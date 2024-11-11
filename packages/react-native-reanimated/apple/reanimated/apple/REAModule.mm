#import <React/RCTBridge+Private.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricSurface.h>
#import <React/RCTScheduler.h>
#import <React/RCTSurface.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <React/RCTSurfaceView.h>
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
#import <reanimated/apple/Fabric/REAInitializerRCTFabricSurface.h>
#endif // RCT_NEW_ARCH_ENABLED

#import <reanimated/RuntimeDecorators/RNRuntimeDecorator.h>
#import <reanimated/Tools/SingleInstanceChecker.h>
#import <reanimated/apple/REAModule.h>
#import <reanimated/apple/REANodesManager.h>
#import <reanimated/apple/REAUIKit.h>
#import <reanimated/apple/native/NativeProxy.h>

#import <worklets/Tools/ReanimatedJSIUtils.h>
#import <worklets/WorkletRuntime/WorkletRuntime.h>
#import <worklets/WorkletRuntime/WorkletRuntimeCollector.h>

#if __has_include(<UIKit/UIAccessibility.h>)
#import <UIKit/UIAccessibility.h>
#endif // __has_include(<UIKit/UIAccessibility.h>)

using namespace facebook::react;
using namespace reanimated;

@interface RCTBridge (JSIRuntime)
- (void *)runtime;
@end

@interface RCTBridge (RCTTurboModule)
- (std::shared_ptr<facebook::react::CallInvoker>)jsCallInvoker;
- (void)_tryAndHandleError:(dispatch_block_t)block;
@end

#ifdef RCT_NEW_ARCH_ENABLED
static __strong REAInitializerRCTFabricSurface *reaSurface;
#else
typedef void (^AnimatedOperation)(REANodesManager *nodesManager);
#endif // RCT_NEW_ARCH_ENABLED

@implementation REAModule {
#ifdef RCT_NEW_ARCH_ENABLED
  __weak RCTSurfacePresenter *_surfacePresenter;
  std::weak_ptr<NativeReanimatedModule> weakNativeReanimatedModule_;
#else
  NSMutableArray<AnimatedOperation> *_operations;
#endif // RCT_NEW_ARCH_ENABLED
#ifndef NDEBUG
  SingleInstanceChecker<REAModule> singleInstanceChecker_;
#endif // NDEBUG
  bool hasListeners;
  bool _isBridgeless;
}

@synthesize moduleRegistry = _moduleRegistry;
#ifdef RCT_NEW_ARCH_ENABLED
@synthesize runtimeExecutor = _runtimeExecutor;
#endif // RCT_NEW_ARCH_ENABLED

RCT_EXPORT_MODULE(ReanimatedModule);

#ifdef RCT_NEW_ARCH_ENABLED
+ (BOOL)requiresMainQueueSetup
{
  return YES;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)invalidate
{
#ifdef RCT_NEW_ARCH_ENABLED
  [[NSNotificationCenter defaultCenter] removeObserver:self];
#endif // RCT_NEW_ARCH_ENABLED
  [_nodesManager invalidate];
  [super invalidate];
}

- (dispatch_queue_t)methodQueue
{
  // This module needs to be on the same queue as the UIManager to avoid
  // having to lock `_operations` and `_preOperations` since `uiManagerWillPerformMounting`
  // will be called from that queue.
  return RCTGetUIManagerQueue();
}

#ifdef RCT_NEW_ARCH_ENABLED

- (std::shared_ptr<UIManager>)getUIManager
{
  RCTScheduler *scheduler = [_surfacePresenter scheduler];
  return scheduler.uiManager;
}

- (void)injectDependencies:(jsi::Runtime &)runtime
{
  const auto &uiManager = [self getUIManager];
  react_native_assert(uiManager.get() != nil);
  if (auto nativeReanimatedModule = weakNativeReanimatedModule_.lock()) {
    nativeReanimatedModule->initializeFabric(uiManager);
  }
}

#pragma mark-- Initialize

- (void)installReanimatedAfterReload
{
  // called from REAInitializerRCTFabricSurface::start
  __weak __typeof__(self) weakSelf = self;
  _surfacePresenter = self.bridge.surfacePresenter;
  [_nodesManager setSurfacePresenter:_surfacePresenter];

  // to avoid deadlock we can't use Executor from React Native
  // but we can create own and use it because initialization is already synchronized
  react_native_assert(self.bridge != nil);
  RCTRuntimeExecutorFromBridge(self.bridge)(^(jsi::Runtime &runtime) {
    if (__typeof__(self) strongSelf = weakSelf) {
      [strongSelf injectDependencies:runtime];
    }
  });
}

- (void)handleJavaScriptDidLoadNotification:(NSNotification *)notification
{
  [self attachReactEventListener];
}

- (void)attachReactEventListener
{
  RCTScheduler *scheduler = [_surfacePresenter scheduler];
  __weak __typeof__(self) weakSelf = self;
  _surfacePresenter.runtimeExecutor(^(jsi::Runtime &runtime) {
    __typeof__(self) strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }
    if (auto nativeReanimatedModule = strongSelf->weakNativeReanimatedModule_.lock()) {
      auto eventListener =
          std::make_shared<facebook::react::EventListener>([nativeReanimatedModule](const RawEvent &rawEvent) {
            if (!RCTIsMainQueue()) {
              // event listener called on the JS thread, let's ignore this event
              // as we cannot safely access worklet runtime here
              // and also we don't care about topLayout events
              return false;
            }
            return nativeReanimatedModule->handleRawEvent(rawEvent, CACurrentMediaTime() * 1000);
          });
      [scheduler addEventListener:eventListener];
    }
  });
}

#pragma mark-- Bridgeless methods

/*
 * Taken from RCTNativeAnimatedTurboModule:
 * This selector is invoked via BridgelessTurboModuleSetup.
 */
- (void)setSurfacePresenter:(id<RCTSurfacePresenterStub>)surfacePresenter
{
  _surfacePresenter = surfacePresenter;
  _isBridgeless = true;
}

- (void)setBridge:(RCTBridge *)bridge
{
  [super setBridge:bridge];
  // only within the first loading `self.bridge.surfacePresenter` exists
  // during the reload `self.bridge.surfacePresenter` is null
  if (self.bridge.surfacePresenter) {
    _surfacePresenter = self.bridge.surfacePresenter;
  }

  [self setReaSurfacePresenter];

  _nodesManager = [[REANodesManager alloc] initWithModule:self bridge:bridge surfacePresenter:_surfacePresenter];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleJavaScriptDidLoadNotification:)
                                               name:RCTJavaScriptDidLoadNotification
                                             object:nil];

  [[self.moduleRegistry moduleForName:"EventDispatcher"] addDispatchObserver:self];
}

- (void)setReaSurfacePresenter
{
  if (reaSurface == nil) {
    // we need only one instance because SurfacePresenter is the same during the application lifetime
    reaSurface = [[REAInitializerRCTFabricSurface alloc] init];
    [_surfacePresenter registerSurface:reaSurface];
  }
  reaSurface.reaModule = self;
}

#else // RCT_NEW_ARCH_ENABLED

- (void)setBridge:(RCTBridge *)bridge
{
  [super setBridge:bridge];

  _nodesManager = [[REANodesManager alloc] initWithModule:self uiManager:self.bridge.uiManager];
  _operations = [NSMutableArray new];

  [bridge.uiManager.observerCoordinator addObserver:self];
  _animationsManager = [[REAAnimationsManager alloc] initWithUIManager:bridge.uiManager];
}

#pragma mark-- Batch handling

- (void)addOperationBlock:(AnimatedOperation)operation
{
  [_operations addObject:operation];
}

#pragma mark - RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(RCTUIManager *)uiManager
{
  [_nodesManager maybeFlushUpdateBuffer];
  if (_operations.count == 0) {
    return;
  }

  NSArray<AnimatedOperation> *operations = _operations;
  _operations = [NSMutableArray new];

  REANodesManager *nodesManager = _nodesManager;

  [uiManager
      addUIBlock:^(__unused RCTUIManager *manager, __unused NSDictionary<NSNumber *, REAUIView *> *viewRegistry) {
        for (AnimatedOperation operation in operations) {
          operation(nodesManager);
        }
        [nodesManager operationsBatchDidComplete];
      }];
}

#endif // RCT_NEW_ARCH_ENABLED

#pragma mark-- Events

- (NSArray<NSString *> *)supportedEvents
{
  return @[ @"onReanimatedCall", @"onReanimatedPropsChange" ];
}

- (void)eventDispatcherWillDispatchEvent:(id<RCTEvent>)event
{
  // Events can be dispatched from any queue
  [_nodesManager dispatchEvent:event];
}

- (void)startObserving
{
  hasListeners = YES;
}

- (void)stopObserving
{
  hasListeners = NO;
}

- (void)sendEventWithName:(NSString *)eventName body:(id)body
{
  if (hasListeners) {
    [super sendEventWithName:eventName body:body];
  }
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(installTurboModule : (nonnull NSString *)valueUnpackerCode)
{
  if (_isBridgeless) {
#ifdef RCT_NEW_ARCH_ENABLED
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
    auto &rnRuntime = *(jsi::Runtime *)cxxBridge.runtime;
    auto executorFunction = ([executor = _runtimeExecutor](std::function<void(jsi::Runtime & runtime)> &&callback) {
      // Convert to Objective-C block so it can be captured properly.
      __block auto callbackBlock = callback;

      [executor execute:^(jsi::Runtime &runtime) {
        callbackBlock(runtime);
      }];
    });
    auto nativeReanimatedModule = reanimated::createReanimatedModuleBridgeless(
        _moduleRegistry, rnRuntime, std::string([valueUnpackerCode UTF8String]), executorFunction);
    [self attachReactEventListener];
    [self commonInit:nativeReanimatedModule withRnRuntime:rnRuntime];
#else
    [NSException raise:@"Missing bridge" format:@"[Reanimated] Failed to obtain the bridge."];
#endif // RCT_NEW_ARCH_ENABLED
  } else {
    facebook::jsi::Runtime *jsiRuntime = [self.bridge respondsToSelector:@selector(runtime)]
        ? reinterpret_cast<facebook::jsi::Runtime *>(self.bridge.runtime)
        : nullptr;

    if (jsiRuntime) {
      auto nativeReanimatedModule = reanimated::createReanimatedModule(
          self, self.bridge, self.bridge.jsCallInvoker, std::string([valueUnpackerCode UTF8String]));
      jsi::Runtime &rnRuntime = *jsiRuntime;

      [self commonInit:nativeReanimatedModule withRnRuntime:rnRuntime];
    }
  }
  return @YES;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeReanimatedModuleSpecJSI>(params);
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)commonInit:(std::shared_ptr<NativeReanimatedModule>)nativeReanimatedModule
     withRnRuntime:(jsi::Runtime &)rnRuntime
{
  WorkletRuntimeCollector::install(rnRuntime);
  RNRuntimeDecorator::decorate(rnRuntime, nativeReanimatedModule);
#ifdef RCT_NEW_ARCH_ENABLED
  weakNativeReanimatedModule_ = nativeReanimatedModule;
  if (self->_surfacePresenter != nil) {
    // reload, uiManager is null right now, we need to wait for `installReanimatedAfterReload`
    [self injectDependencies:rnRuntime];
  }
#endif // RCT_NEW_ARCH_ENABLED
}

@end
