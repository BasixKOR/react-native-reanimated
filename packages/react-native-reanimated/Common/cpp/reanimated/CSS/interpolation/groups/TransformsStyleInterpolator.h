#pragma once

#include <reanimated/CSS/interpolation/PropertyInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/TransformInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/TransformOperation.h>
#include <reanimated/CSS/util/keyframes.h>

namespace reanimated {

struct TransformKeyframe {
  const double offset;
  // If the value is nullopt, we would have to read it from the view style
  // (in all other cases, both vectors will have the same number of elements of
  // corresponding types  - elements from the same index will form interpolation
  // pairs)
  const std::optional<TransformOperations> fromOperations;
  const std::optional<TransformOperations> toOperations;
};

class TransformsStyleInterpolator : public PropertyInterpolator {
 public:
  TransformsStyleInterpolator(
      const TransformInterpolators &interpolators,
      const std::shared_ptr<ViewStylesRepository> &viewStylesRepository,
      const PropertyPath &propertyPath);

  jsi::Value getStyleValue(
      jsi::Runtime &rt,
      const ShadowNode::Shared &shadowNode) const override;

  jsi::Value update(const InterpolationUpdateContext &context) override;

  void updateKeyframes(jsi::Runtime &rt, const jsi::Value &keyframes) override;
  void updateKeyframesFromStyleChange(
      jsi::Runtime &rt,
      const jsi::Value &oldStyleValue,
      const jsi::Value &newStyleValue) override;

 private:
  const TransformInterpolators interpolators_;
  const std::shared_ptr<ViewStylesRepository> viewStylesRepository_;

  size_t keyframeIndex_ = 0;
  std::vector<std::shared_ptr<TransformKeyframe>> keyframes_;
  std::shared_ptr<TransformKeyframe> currentKeyframe_;
  std::optional<TransformOperations> previousResult_;

  TransformInterpolators convertInterpolators(
      const TransformInterpolatorsMap &interpolators) const;

  std::optional<TransformOperations> parseTransformOperations(
      jsi::Runtime &rt,
      const jsi::Value &values) const;

  std::shared_ptr<TransformKeyframe> createTransformKeyframe(
      jsi::Runtime &rt,
      const double offset,
      const std::optional<TransformOperations> &fromOperationsOptional,
      const std::optional<TransformOperations> &toOperationsOptional) const;

  void addConvertedOperations(
      const std::shared_ptr<TransformOperation> &sourceOperation,
      const std::shared_ptr<TransformOperation> &targetOperation,
      TransformOperations &sourceResult,
      TransformOperations &targetResult) const;

  TransformOperations getFallbackValue(
      const InterpolationUpdateContext context) const;

  std::shared_ptr<TransformOperation> getDefaultOperationOfType(
      TransformOperationType type) const;

  TransformOperations resolveTransformOperations(
      const std::optional<TransformOperations> &unresolvedOperations,
      const InterpolationUpdateContext &context) const;

  std::shared_ptr<TransformKeyframe> getKeyframeAtIndex(
      size_t index,
      int resolveDirection, // < 0 - resolve from, > 0 - resolve to
      const InterpolationUpdateContext &context) const;

  void updateCurrentKeyframe(const InterpolationUpdateContext &context);

  inline double calculateLocalProgress(const double progress) const;

  TransformOperations interpolateOperations(
      const double localProgress,
      const TransformOperations &fromOperations,
      const TransformOperations &toOperations,
      const InterpolationUpdateContext &context) const;

  jsi::Value convertResultToJSI(
      jsi::Runtime &rt,
      const TransformOperations &operations) const;
};

} // namespace reanimated
