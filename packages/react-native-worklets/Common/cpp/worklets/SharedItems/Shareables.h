#pragma once

#include <worklets/Registries/WorkletRuntimeRegistry.h>

#include <jsi/jsi.h>

#include <memory>
#include <string>
#include <utility>
#include <vector>

using namespace facebook;

namespace worklets {

jsi::Function getValueUnpacker(jsi::Runtime &rt);

#ifndef NDEBUG
jsi::Function getCallGuard(jsi::Runtime &rt);
#endif // NDEBUG

// If possible, please use `WorkletRuntime::runGuarded` instead.
template <typename... Args>
inline jsi::Value runOnRuntimeGuarded(
    jsi::Runtime &rt,
    const jsi::Value &function,
    Args &&...args) {
  // We only use callGuard in debug mode, otherwise we call the provided
  // function directly. CallGuard provides a way of capturing exceptions in
  // JavaScript and propagating them to the main React Native thread such that
  // they can be presented using RN's LogBox.
#ifndef NDEBUG
  return getCallGuard(rt).call(rt, function, args...);
#else
  return function.asObject(rt).asFunction(rt).call(rt, args...);
#endif // NDEBUG
}

inline void cleanupIfRuntimeExists(
    jsi::Runtime *rt,
    std::unique_ptr<jsi::Value> &value) {
  if (rt != nullptr && !WorkletRuntimeRegistry::isRuntimeAlive(rt)) {
    // The below use of unique_ptr.release prevents the smart pointer from
    // calling the destructor of the kept object. This effectively results in
    // leaking some memory. We do this on purpose, as sometimes we would keep
    // references to JSI objects past the lifetime of its runtime (e.g.,
    // shared values references from the RN VM holds reference to JSI objects
    // on the UI runtime). When the UI runtime is terminated, the orphaned JSI
    // objects would crash the app when their destructors are called, because
    // they call into a memory that's managed by the terminated runtime. We
    // accept the tradeoff of leaking memory here, as it has a limited impact.
    // This scenario can only occur when the React instance is torn down which
    // happens in development mode during app reloads, or in production when
    // the app is being shut down gracefully by the system. An alternative
    // solution would require us to keep track of all JSI values that are in
    // use which would require additional data structure and compute spent on
    // bookkeeping that only for the sake of destroying the values in time
    // before the runtime is terminated. Note that the underlying memory that
    // jsi::Value refers to is managed by the VM and gets freed along with the
    // runtime.
    value.release();
  }
}

class Shareable {
 public:
  virtual jsi::Value toJSValue(jsi::Runtime &rt) = 0;

  virtual ~Shareable();

  enum ValueType {
    UndefinedType,
    NullType,
    BooleanType,
    NumberType,
    // SymbolType, TODO
    BigIntType,
    StringType,
    ObjectType,
    ArrayType,
    MapType,
    SetType,
    WorkletType,
    RemoteFunctionType,
    HandleType,
    HostObjectType,
    HostFunctionType,
    ArrayBufferType,
    TurboModuleLikeType,
    ImportType,
  };

  explicit Shareable(ValueType valueType) : valueType_(valueType) {}

  inline ValueType valueType() const {
    return valueType_;
  }

  static std::shared_ptr<Shareable> undefined();

 protected:
  ValueType valueType_;
};

template <typename BaseClass>
class RetainingShareable : virtual public BaseClass {
 private:
  jsi::Runtime *primaryRuntime_;
  jsi::Runtime *secondaryRuntime_;
  std::unique_ptr<jsi::Value> secondaryValue_;

 public:
  template <typename... Args>
  explicit RetainingShareable(jsi::Runtime &rt, Args &&...args)
      : BaseClass(rt, std::forward<Args>(args)...), primaryRuntime_(&rt) {}

  jsi::Value toJSValue(jsi::Runtime &rt);

  ~RetainingShareable() {
    cleanupIfRuntimeExists(secondaryRuntime_, secondaryValue_);
  }
};

class ShareableJSRef : public jsi::HostObject {
 private:
  const std::shared_ptr<Shareable> value_;

 public:
  explicit ShareableJSRef(const std::shared_ptr<Shareable> &value)
      : value_(value) {}

  virtual ~ShareableJSRef();

  std::shared_ptr<Shareable> value() const {
    return value_;
  }

  static jsi::Object newHostObject(
      jsi::Runtime &rt,
      const std::shared_ptr<Shareable> &value) {
    return jsi::Object::createFromHostObject(
        rt, std::make_shared<ShareableJSRef>(value));
  }
};

jsi::Value makeShareableClone(
    jsi::Runtime &rt,
    const jsi::Value &value,
    const jsi::Value &shouldRetainRemote,
    const jsi::Value &nativeStateSource);

jsi::Value makeShareableString(jsi::Runtime &rt, const jsi::String &string);

jsi::Value makeShareableNumber(jsi::Runtime &rt, double number);

jsi::Value makeShareableBoolean(jsi::Runtime &rt, bool boolean);

jsi::Value makeShareableBigInt(jsi::Runtime &rt, const jsi::BigInt &bigint);

jsi::Value makeShareableUndefined(jsi::Runtime &rt);

jsi::Value makeShareableNull(jsi::Runtime &rt);

jsi::Value makeShareableTurboModuleLike(
    jsi::Runtime &rt,
    const jsi::Object &object,
    const std::shared_ptr<jsi::HostObject> &proto);

jsi::Value makeShareableObject(
    jsi::Runtime &rt,
    jsi::Object object,
    bool shouldRetainRemote,
    const jsi::Value &nativeStateSource);

jsi::Value makeShareableImport(
    jsi::Runtime &rt,
    const double source,
    const jsi::String &imported);

jsi::Value makeShareableHostObject(
    jsi::Runtime &rt,
    const std::shared_ptr<jsi::HostObject> &value);

jsi::Value makeShareableArray(
    jsi::Runtime &rt,
    const jsi::Array &array,
    const jsi::Value &shouldRetainRemote);

jsi::Value makeShareableMap(
    jsi::Runtime &rt,
    const jsi::Array &keys,
    const jsi::Array &values);

jsi::Value makeShareableSet(jsi::Runtime &rt, const jsi::Array &values);

jsi::Value makeShareableInitializer(
    jsi::Runtime &rt,
    const jsi::Object &initializerObject);

jsi::Value makeShareableFunction(jsi::Runtime &rt, jsi::Function function);

jsi::Value makeShareableWorklet(
    jsi::Runtime &rt,
    const jsi::Object &object,
    const bool &shouldRetainRemote);

std::shared_ptr<Shareable> extractShareableOrThrow(
    jsi::Runtime &rt,
    const jsi::Value &maybeShareableValue,
    const std::string &errorMessage =
        "[Worklets] Expecting the object to be of type ShareableJSRef.");

template <typename T>
std::shared_ptr<T> extractShareableOrThrow(
    jsi::Runtime &rt,
    const jsi::Value &shareableRef,
    const std::string &errorMessage =
        "[Worklets] Provided shareable object is of an incompatible type.") {
  auto res = std::dynamic_pointer_cast<T>(
      extractShareableOrThrow(rt, shareableRef, errorMessage));
  if (!res) {
    throw std::runtime_error(errorMessage);
  }
  return res;
}

class ShareableArray : public Shareable {
 public:
  ShareableArray(jsi::Runtime &rt, const jsi::Array &array);

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  std::vector<std::shared_ptr<Shareable>> data_;
};

class ShareableObject : public Shareable {
 public:
  ShareableObject(jsi::Runtime &rt, const jsi::Object &object);

  ShareableObject(
      jsi::Runtime &rt,
      const jsi::Object &object,
      const jsi::Value &nativeStateSource);

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  std::vector<std::pair<std::string, std::shared_ptr<Shareable>>> data_;
  std::shared_ptr<jsi::NativeState> nativeState_;
};

class ShareableMap : public Shareable {
 public:
  ShareableMap(
      jsi::Runtime &rt,
      const jsi::Array &keys,
      const jsi::Array &values);

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  std::vector<std::pair<std::shared_ptr<Shareable>, std::shared_ptr<Shareable>>>
      data_;
};

class ShareableSet : public Shareable {
 public:
  ShareableSet(jsi::Runtime &rt, const jsi::Array &values);

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  std::vector<std::shared_ptr<Shareable>> data_;
};

class ShareableHostObject : public Shareable {
 public:
  ShareableHostObject(
      jsi::Runtime &,
      const std::shared_ptr<jsi::HostObject> &hostObject)
      : Shareable(HostObjectType), hostObject_(hostObject) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  const std::shared_ptr<jsi::HostObject> hostObject_;
};

class ShareableHostFunction : public Shareable {
 public:
  ShareableHostFunction(jsi::Runtime &rt, jsi::Function function)
      : Shareable(HostFunctionType),
        hostFunction_(function.getHostFunction(rt)),
        name_(function.getProperty(rt, "name").asString(rt).utf8(rt)),
        paramCount_(function.getProperty(rt, "length").asNumber()) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  const jsi::HostFunctionType hostFunction_;
  const std::string name_;
  const unsigned int paramCount_;
};

class ShareableArrayBuffer : public Shareable {
 public:
  ShareableArrayBuffer(jsi::Runtime &rt, const jsi::ArrayBuffer &arrayBuffer)
      : Shareable(ArrayBufferType),
        data_(
            arrayBuffer.data(rt),
            arrayBuffer.data(rt) + arrayBuffer.size(rt)) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  const std::vector<uint8_t> data_;
};

class ShareableWorklet : public ShareableObject {
 public:
  ShareableWorklet(jsi::Runtime &rt, const jsi::Object &worklet)
      : ShareableObject(rt, worklet) {
    valueType_ = WorkletType;
  }

  jsi::Value toJSValue(jsi::Runtime &rt) override;
};

class ShareableImport : public Shareable {
 public:
  ShareableImport(
      jsi::Runtime &rt,
      const double source,
      const jsi::String &imported)
      : Shareable(ImportType), source_(source), imported_(imported.utf8(rt)) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  const double source_;
  const std::string imported_;
};

class ShareableRemoteFunction
    : public Shareable,
      public std::enable_shared_from_this<ShareableRemoteFunction> {
 private:
  jsi::Runtime *runtime_;
#ifndef NDEBUG
  const std::string name_;
#endif
  std::unique_ptr<jsi::Value> function_;

 public:
  ShareableRemoteFunction(jsi::Runtime &rt, jsi::Function &&function)
      : Shareable(RemoteFunctionType),
        runtime_(&rt),
#ifndef NDEBUG
        name_(function.getProperty(rt, "name").asString(rt).utf8(rt)),
#endif
        function_(std::make_unique<jsi::Value>(rt, std::move(function))) {
  }

  ~ShareableRemoteFunction() {
    cleanupIfRuntimeExists(runtime_, function_);
  }

  jsi::Value toJSValue(jsi::Runtime &rt) override;
};

class ShareableInitializer : public Shareable {
 private:
  // We don't release the initializer since the handle can get
  // initialized in parallel on multiple threads. However this is not a problem,
  // since the final value is taken from a cache on the runtime which guarantees
  // sequential access.
  std::unique_ptr<ShareableObject> initializer_;
  std::unique_ptr<jsi::Value> remoteValue_;
  mutable std::mutex initializationMutex_;
  jsi::Runtime *remoteRuntime_;

 public:
  ShareableInitializer(jsi::Runtime &rt, const jsi::Object &initializerObject)
      : Shareable(HandleType),
        initializer_(std::make_unique<ShareableObject>(rt, initializerObject)) {
  }

  ~ShareableInitializer() {
    cleanupIfRuntimeExists(remoteRuntime_, remoteValue_);
  }

  jsi::Value toJSValue(jsi::Runtime &rt) override;
};

class ShareableString : public Shareable {
 public:
  explicit ShareableString(const std::string &string)
      : Shareable(StringType), data_(string) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  const std::string data_;
};

class ShareableBigInt : public Shareable {
 public:
  explicit ShareableBigInt(jsi::Runtime &rt, const jsi::BigInt &bigint)
      : Shareable(BigIntType), string_(bigint.toString(rt).utf8(rt)) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 protected:
  const std::string string_;
};

class ShareableScalar : public Shareable {
 public:
  explicit ShareableScalar(double number) : Shareable(NumberType) {
    data_.number = number;
  }
  explicit ShareableScalar(bool boolean) : Shareable(BooleanType) {
    data_.boolean = boolean;
  }
  ShareableScalar() : Shareable(UndefinedType) {}
  explicit ShareableScalar(std::nullptr_t) : Shareable(NullType) {}

  jsi::Value toJSValue(jsi::Runtime &);

 protected:
  union Data {
    bool boolean;
    double number;
  };

 private:
  Data data_;
};

class ShareableTurboModuleLike : public Shareable {
 public:
  ShareableTurboModuleLike(
      jsi::Runtime &rt,
      const jsi::Object &object,
      const std::shared_ptr<jsi::HostObject> &proto)
      : Shareable(TurboModuleLikeType),
        proto_(std::make_unique<ShareableHostObject>(rt, proto)),
        properties_(std::make_unique<ShareableObject>(rt, object)) {}

  jsi::Value toJSValue(jsi::Runtime &rt) override;

 private:
  const std::unique_ptr<ShareableHostObject> proto_;
  const std::unique_ptr<ShareableObject> properties_;
};

} // namespace worklets
