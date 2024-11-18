#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/interpolation/transforms/TransformInterpolator.h>

#include <memory>

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

#endif // RCT_NEW_ARCH_ENABLED
