#include <reanimated/CSS/interpolation/values/ValueInterpolator.h>

namespace reanimated {

template <typename T>
ValueInterpolator<T>::ValueInterpolator(
    const std::optional<T> &defaultStyleValue,
    const std::shared_ptr<ViewStylesRepository> &viewStylesRepository,
    const PropertyPath &propertyPath)
    : Interpolator(propertyPath),
      viewStylesRepository_(viewStylesRepository),
      defaultStyleValue_(defaultStyleValue) {}

template <typename T>
jsi::Value ValueInterpolator<T>::getCurrentValue(jsi::Runtime &rt) const {
  return previousValue_.has_value()
      ? convertResultToJSI(rt, previousValue_.value())
      : jsi::Value::undefined();
}

template <typename T>
jsi::Value ValueInterpolator<T>::getStyleValue(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode) const {
  return viewStylesRepository_->getStyleProp(
      rt, shadowNode->getTag(), propertyPath_);
}

template <typename T>
void ValueInterpolator<T>::updateKeyframes(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode,
    const jsi::Value &keyframes) {
  keyframeAfterIndex_ = 1;
  const auto keyframeArray = keyframes.asObject(rt).asArray(rt);
  const auto inputKeyframesCount = keyframeArray.size(rt);

  auto getKeyframeAtIndexOffset = [&](size_t index) {
    return keyframeArray.getValueAtIndex(rt, index)
        .asObject(rt)
        .getProperty(rt, "offset")
        .asNumber();
  };

  bool hasOffset0 = getKeyframeAtIndexOffset(0) == 0;
  bool hasOffset1 = getKeyframeAtIndexOffset(inputKeyframesCount - 1) == 1;

  // Clear the existing keyframes_ property
  keyframes_.clear();
  keyframes_.reserve(
      inputKeyframesCount + (hasOffset0 ? 0 : 1) + (hasOffset1 ? 0 : 1));

  // Insert the keyframe without value at offset 0 if it is not present
  if (!hasOffset0) {
    keyframes_.push_back({0, std::nullopt});
  }

  // Insert all provided keyframes
  for (size_t j = 0; j < inputKeyframesCount; ++j) {
    jsi::Object keyframeObject =
        keyframeArray.getValueAtIndex(rt, j).asObject(rt);
    double offset = keyframeObject.getProperty(rt, "offset").asNumber();
    jsi::Value value = keyframeObject.getProperty(rt, "value");

    // Add a keyframe with no value if there is no keyframe value specified
    if (value.isUndefined()) {
      keyframes_.push_back({offset, std::nullopt});
    } else {
      keyframes_.push_back({offset, prepareKeyframeValue(rt, value)});
    }
  }

  // Insert the keyframe without value at offset 1 if it is not present
  if (!hasOffset1) {
    keyframes_.push_back({1, std::nullopt});
  }
}

template <typename T>
void ValueInterpolator<T>::updateKeyframesFromStyleChange(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode,
    const jsi::Value &oldStyleValue,
    const jsi::Value &newStyleValue) {
  keyframeAfterIndex_ = 1;
  Keyframe<T> firstKeyframe, lastKeyframe;

  // If the transition was interrupted, use the previous interpolation
  // result as the first keyframe value
  if (previousValue_.has_value()) {
    firstKeyframe = {0, previousValue_};
  } else {
    // If the new transition of the property was started, use the old style
    // value as the first keyframe value if it was provided
    if (!oldStyleValue.isUndefined()) {
      firstKeyframe = {0, prepareKeyframeValue(rt, oldStyleValue)};
    }
    // Otherwise, fallback to the default style value is no style value was
    // provided for the view property
    else {
      firstKeyframe = {0, defaultStyleValue_};
    }
  }

  // Animate to the default style value if the target value is undefined
  if (newStyleValue.isUndefined()) {
    lastKeyframe = {1, defaultStyleValue_};
  } else {
    lastKeyframe = {1, prepareKeyframeValue(rt, newStyleValue)};
  }

  keyframes_ = {firstKeyframe, lastKeyframe};
}

template <typename T>
jsi::Value ValueInterpolator<T>::update(
    const InterpolationUpdateContext context) {
  updateCurrentKeyframes(context);

  const auto localProgress =
      calculateLocalProgress(keyframeBefore_, keyframeAfter_, context);

  std::optional<T> fromValue = keyframeBefore_.value;
  std::optional<T> toValue = keyframeAfter_.value;

  if (!fromValue.has_value()) {
    fromValue = getFallbackValue(context);
  }
  if (!toValue.has_value()) {
    toValue = getFallbackValue(context);
  }

  // If at least one of keyframes has no value set and there is no fallback
  // value, interpolate as if values were discrete
  if (!fromValue.has_value() || !toValue.has_value()) {
    return interpolateMissingValue(localProgress, fromValue, toValue, context);
  }

  T value =
      interpolate(localProgress, fromValue.value(), toValue.value(), context);
  previousValue_ = value;

  return convertResultToJSI(context.rt, value);
}

template <typename T>
std::optional<T> ValueInterpolator<T>::getFallbackValue(
    const InterpolationUpdateContext context) const {
  const jsi::Value &styleValue = getStyleValue(context.rt, context.node);
  return styleValue.isUndefined()
      ? defaultStyleValue_
      : prepareKeyframeValue(context.rt, styleValue);
}

template <typename T>
std::optional<T> ValueInterpolator<T>::resolveKeyframeValue(
    const std::optional<T> unresolvedValue,
    const InterpolationUpdateContext context) const {
  if (!unresolvedValue.has_value()) {
    return std::nullopt;
  }
  const auto value = unresolvedValue.value();
  return interpolate(0, value, value, context);
}

template <typename T>
Keyframe<T> ValueInterpolator<T>::getKeyframeAtIndex(
    int index,
    bool shouldResolve,
    const InterpolationUpdateContext context) const {
  // This should never happen
  if (index < 0 || index >= keyframes_.size()) {
    throw std::invalid_argument("[Reanimated] Keyframe index out of bounds.");
  }

  const auto keyframe = keyframes_.at(index);
  const double offset = keyframe.offset;

  if (shouldResolve) {
    T unresolvedValue;

    if (keyframe.value.has_value()) {
      unresolvedValue = keyframe.value.value();
    } else {
      const auto fallbackValue = getFallbackValue(context);
      if (fallbackValue.has_value()) {
        unresolvedValue = fallbackValue.value();
      } else {
        return Keyframe<T>{offset, std::nullopt};
      }
    }

    return Keyframe<T>{offset, resolveKeyframeValue(unresolvedValue, context)};
  }

  return keyframe;
}

template <typename T>
void ValueInterpolator<T>::updateCurrentKeyframes(
    const InterpolationUpdateContext context) {
  const bool isProgressLessThanHalf = context.progress < 0.5;
  const auto prevAfterIndex = keyframeAfterIndex_;

  if (!context.previousProgress.has_value()) {
    keyframeAfterIndex_ = isProgressLessThanHalf ? 1 : keyframes_.size() - 1;
  }

  while (context.progress < 1 && keyframeAfterIndex_ < keyframes_.size() - 1 &&
         keyframes_[keyframeAfterIndex_].offset <= context.progress)
    ++keyframeAfterIndex_;

  while (context.progress > 0 && keyframeAfterIndex_ > 1 &&
         keyframes_[keyframeAfterIndex_ - 1].offset >= context.progress)
    --keyframeAfterIndex_;

  if (context.previousProgress.has_value()) {
    if (keyframeAfterIndex_ != prevAfterIndex) {
      keyframeBefore_ = getKeyframeAtIndex(
          keyframeAfterIndex_ - 1,
          keyframeAfterIndex_ > prevAfterIndex,
          context);
      keyframeAfter_ = getKeyframeAtIndex(
          keyframeAfterIndex_, keyframeAfterIndex_ < prevAfterIndex, context);
    }

    if (context.directionChanged && previousValue_.has_value()) {
      const Keyframe<T> keyframe = {
          context.previousProgress.value(), previousValue_.value()};
      if (context.progress < context.previousProgress.value()) {
        keyframeAfter_ = keyframe;
      } else {
        keyframeBefore_ = keyframe;
      }
    }
  } else {
    keyframeBefore_ = getKeyframeAtIndex(
        keyframeAfterIndex_ - 1, isProgressLessThanHalf, context);
    keyframeAfter_ = getKeyframeAtIndex(
        keyframeAfterIndex_, !isProgressLessThanHalf, context);
  }
}

template <typename T>
double ValueInterpolator<T>::calculateLocalProgress(
    const Keyframe<T> &keyframeBefore,
    const Keyframe<T> &keyframeAfter,
    const InterpolationUpdateContext context) const {
  const double beforeOffset = keyframeBefore.offset;
  const double afterOffset = keyframeAfter.offset;

  if (afterOffset == beforeOffset) {
    return 1;
  }

  return (context.progress - beforeOffset) / (afterOffset - beforeOffset);
}

template <typename T>
jsi::Value ValueInterpolator<T>::interpolateMissingValue(
    double localProgress,
    const std::optional<T> &fromValue,
    const std::optional<T> &toValue,
    const InterpolationUpdateContext context) const {
  return jsi::Value::undefined();
  const auto selectedValue = localProgress < 0.5 ? fromValue : toValue;
  return selectedValue.has_value()
      ? convertResultToJSI(context.rt, selectedValue.value())
      : jsi::Value::undefined();
}

// Declare the types that will be used in the ValueInterpolator class
template class ValueInterpolator<int>;
template class ValueInterpolator<double>;
template class ValueInterpolator<std::string>;
template class ValueInterpolator<std::vector<double>>;
template class ValueInterpolator<ColorArray>;
template class ValueInterpolator<RelativeOrNumericInterpolatorValue>;

} // namespace reanimated
