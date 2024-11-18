#ifdef RCT_NEW_ARCH_ENABLED
#include <reanimated/CSS/easing/StepsEasing.h>

namespace reanimated {
EasingFunction createStepsEasingFunction(
    const std::vector<double> &arrX,
    const std::vector<double> &arrY) {
  return [=](double x) {
    size_t stepIdx = firstSmallerThanOrEqualBinsearch(x, arrX);
    return arrY[stepIdx];
  };
}

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
