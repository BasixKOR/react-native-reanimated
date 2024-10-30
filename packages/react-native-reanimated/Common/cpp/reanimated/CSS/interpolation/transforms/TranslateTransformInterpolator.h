#pragma once

#include <reanimated/CSS/interpolation/transforms/TransformInterpolator.h>

namespace reanimated {

template <typename OperationType>
class TranslateTransformInterpolator final
    : public TransformInterpolatorBase<OperationType> {
 public:
  TranslateTransformInterpolator(
      RelativeTo relativeTo,
      const std::string &relativeProperty,
      const UnitValue &defaultValue);

 protected:
  OperationType interpolate(
      double progress,
      const OperationType &fromOperation,
      const OperationType &toOperation,
      const TransformInterpolatorUpdateContext &context) const override;
  OperationType resolveOperation(
      const OperationType &operation,
      const ShadowNode::Shared &shadowNode,
      const std::shared_ptr<ViewStylesRepository> &viewStylesRepository)
      const override;

 private:
  const RelativeTo relativeTo_;
  const std::string relativeProperty_;
};

} // namespace reanimated
