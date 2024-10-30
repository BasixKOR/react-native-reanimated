#pragma once

#include <reanimated/CSS/interpolation/transforms/TransformInterpolator.h>

namespace reanimated {

template <typename OperationType>
class ScaleTransformInterpolator final
    : public TransformInterpolatorBase<OperationType> {
 public:
  explicit ScaleTransformInterpolator(double defaultValue);

 protected:
  OperationType interpolate(
      double progress,
      const OperationType &fromOperation,
      const OperationType &toOperation,
      const TransformInterpolatorUpdateContext &context) const override;
};

} // namespace reanimated
