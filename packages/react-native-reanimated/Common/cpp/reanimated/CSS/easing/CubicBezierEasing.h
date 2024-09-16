#pragma once

#include <cmath>
#include <functional>

#include <reanimated/CSS/EasingFunction.h>

namespace reanimated {

double sampleCurveX(double t, double x1, double x2);
double sampleCurveY(double t, double y1, double y2);
double sampleCurveDerivativeX(double t, double x1, double x2);
double solveCurveX(double x, double x1, double x2, double epsilon = 1e-6);
EasingFunction createBezierFunction(double x1, double y1, double x2, double y2);

} // namespace reanimated
