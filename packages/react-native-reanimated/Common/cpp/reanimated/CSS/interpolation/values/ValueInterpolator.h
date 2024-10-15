#pragma once

#include <reanimated/CSS/interpolation/PropertyInterpolator.h>
#include <reanimated/CSS/util/keyframes.h>

namespace reanimated {

template <typename T>
struct ValueKeyframe {
  double offset;
  // If value is optional, the style value should be read from the view style
  std::optional<T> value;
};

template <typename T>
class ValueInterpolator : public PropertyInterpolator {
 public:
  explicit ValueInterpolator(
      const std::optional<T> &defaultStyleValue,
      const std::shared_ptr<ViewStylesRepository> &viewStylesRepository,
      const PropertyPath &propertyPath);

  jsi::Value getStyleValue(
      jsi::Runtime &rt,
      const ShadowNode::Shared &shadowNode) const override;

  virtual void updateKeyframes(jsi::Runtime &rt, const jsi::Value &keyframes)
      override;
  virtual void updateKeyframesFromStyleChange(
      jsi::Runtime &rt,
      const jsi::Value &oldStyleValue,
      const jsi::Value &newStyleValue) override;

  jsi::Value update(const InterpolationUpdateContext &context) override;

 protected:
  std::optional<T> defaultStyleValue_; // Default style value

  virtual T prepareKeyframeValue(jsi::Runtime &rt, const jsi::Value &value)
      const = 0;

  virtual jsi::Value convertResultToJSI(jsi::Runtime &rt, const T &value)
      const = 0;

  virtual T interpolate(
      double localProgress,
      const T &fromValue,
      const T &toValue,
      const InterpolationUpdateContext context) const = 0;

 private:
  std::vector<ValueKeyframe<T>> keyframes_;
  std::shared_ptr<ViewStylesRepository> viewStylesRepository_;

  int keyframeAfterIndex_ = 1;
  ValueKeyframe<T> keyframeBefore_;
  ValueKeyframe<T> keyframeAfter_;
  std::optional<T> previousValue_; // Previous interpolation result

  std::optional<T> getFallbackValue(
      const InterpolationUpdateContext context) const;

  std::optional<T> resolveKeyframeValue(
      const std::optional<T> unresolvedValue,
      const InterpolationUpdateContext context) const;

  ValueKeyframe<T> getKeyframeAtIndex(
      size_t index,
      bool shouldResolve,
      const InterpolationUpdateContext context) const;

  void updateCurrentKeyframes(const InterpolationUpdateContext context);

  double calculateLocalProgress(
      const ValueKeyframe<T> &keyframeBefore,
      const ValueKeyframe<T> &keyframeAfter,
      const InterpolationUpdateContext context) const;

  jsi::Value interpolateMissingValue(
      double localProgress,
      const std::optional<T> &fromValue,
      const std::optional<T> &toValue,
      const InterpolationUpdateContext context) const;
};

} // namespace reanimated
