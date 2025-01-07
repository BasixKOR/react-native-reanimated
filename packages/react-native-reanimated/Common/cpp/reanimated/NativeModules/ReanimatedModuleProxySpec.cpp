#include <reanimated/NativeModules/ReanimatedModuleProxySpec.h>

#include <utility>

#define REANIMATED_SPEC_PREFIX(FN_NAME) \
  __hostFunction_ReanimatedModuleProxySpec_##FN_NAME

namespace reanimated {

static jsi::Value REANIMATED_SPEC_PREFIX(registerEventHandler)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  return static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->registerEventHandler(
          rt, std::move(args[0]), std::move(args[1]), std::move(args[2]));
}

static jsi::Value REANIMATED_SPEC_PREFIX(unregisterEventHandler)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->unregisterEventHandler(rt, std::move(args[0]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(getViewProp)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->getViewProp(
          rt, std::move(args[0]), std::move(args[1]), std::move(args[2]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(enableLayoutAnimations)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->enableLayoutAnimations(rt, std::move(args[0]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(registerSensor)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  return static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->registerSensor(
          rt,
          std::move(args[0]),
          std::move(args[1]),
          std::move(args[2]),
          std::move(args[3]));
}

static jsi::Value REANIMATED_SPEC_PREFIX(unregisterSensor)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->unregisterSensor(rt, std::move(args[0]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(configureProps)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->configureProps(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(subscribeForKeyboardEvents)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  return static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->subscribeForKeyboardEvents(
          rt, std::move(args[0]), std::move(args[1]), std::move(args[2]));
}

static jsi::Value REANIMATED_SPEC_PREFIX(unsubscribeFromKeyboardEvents)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->unsubscribeFromKeyboardEvents(rt, std::move(args[0]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(configureLayoutAnimationBatch)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  return static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->configureLayoutAnimationBatch(rt, std::move(args[0]));
}

static jsi::Value REANIMATED_SPEC_PREFIX(setShouldAnimateExiting)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->setShouldAnimateExiting(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

#ifdef RCT_NEW_ARCH_ENABLED

static jsi::Value REANIMATED_SPEC_PREFIX(setViewStyle)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->setViewStyle(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(removeViewStyle)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->removeViewStyle(rt, std::move(args[0]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(registerCSSAnimations)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->registerCSSAnimations(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(updateCSSAnimations)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->updateCSSAnimations(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(unregisterCSSAnimations)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->unregisterCSSAnimations(std::move(args[0]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(registerCSSTransition)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->registerCSSTransition(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(updateCSSTransition)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->updateCSSTransition(rt, std::move(args[0]), std::move(args[1]));
  return jsi::Value::undefined();
}

static jsi::Value REANIMATED_SPEC_PREFIX(unregisterCSSTransition)(
    jsi::Runtime &rt,
    TurboModule &turboModule,
    const jsi::Value *args,
    size_t) {
  static_cast<ReanimatedModuleProxySpec *>(&turboModule)
      ->unregisterCSSTransition(rt, std::move(args[0]));
  return jsi::Value::undefined();
}

#endif // RCT_NEW_ARCH_ENABLED

ReanimatedModuleProxySpec::ReanimatedModuleProxySpec(
    const std::shared_ptr<CallInvoker> &jsInvoker)
    : TurboModule("NativeReanimated", jsInvoker) {
  methodMap_["registerEventHandler"] =
      MethodMetadata{3, REANIMATED_SPEC_PREFIX(registerEventHandler)};
  methodMap_["unregisterEventHandler"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(unregisterEventHandler)};

  methodMap_["getViewProp"] =
      MethodMetadata{3, REANIMATED_SPEC_PREFIX(getViewProp)};
  methodMap_["enableLayoutAnimations"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(enableLayoutAnimations)};
  methodMap_["registerSensor"] =
      MethodMetadata{4, REANIMATED_SPEC_PREFIX(registerSensor)};
  methodMap_["unregisterSensor"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(unregisterSensor)};
  methodMap_["configureProps"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(configureProps)};
  methodMap_["subscribeForKeyboardEvents"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(subscribeForKeyboardEvents)};
  methodMap_["unsubscribeFromKeyboardEvents"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(unsubscribeFromKeyboardEvents)};

  methodMap_["configureLayoutAnimationBatch"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(configureLayoutAnimationBatch)};
  methodMap_["setShouldAnimateExitingForTag"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(setShouldAnimateExiting)};

#ifdef RCT_NEW_ARCH_ENABLED
        
  methodMap_["setViewStyle"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(setViewStyle)};
  methodMap_["removeViewStyle"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(removeViewStyle)};

  methodMap_["registerCSSAnimations"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(registerCSSAnimations)};
  methodMap_["updateCSSAnimations"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(updateCSSAnimations)};
  methodMap_["unregisterCSSAnimations"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(unregisterCSSAnimations)};

  methodMap_["registerCSSTransition"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(registerCSSTransition)};
  methodMap_["updateCSSTransition"] =
      MethodMetadata{2, REANIMATED_SPEC_PREFIX(updateCSSTransition)};
  methodMap_["unregisterCSSTransition"] =
      MethodMetadata{1, REANIMATED_SPEC_PREFIX(unregisterCSSTransition)};
        
#endif
}
} // namespace reanimated
