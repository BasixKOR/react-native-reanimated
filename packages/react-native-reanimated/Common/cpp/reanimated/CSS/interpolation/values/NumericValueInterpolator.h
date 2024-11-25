#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/interpolation/values/ValueInterpolator.h>

namespace reanimated {

class NumericValueInterpolator : public ValueInterpolator<double> {
 public:
  using ValueInterpolator<double>::ValueInterpolator;

 protected:
  double prepareKeyframeValue(jsi::Runtime &rt, const jsi::Value &value)
      const override;

  jsi::Value convertResultToJSI(jsi::Runtime &rt, const double &value)
      const override {
    return {value};
  }

  double interpolate(
      double progress,
      const double &fromValue,
      const double &toValue,
      const ValueInterpolatorUpdateContext &context) const override;
};

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
