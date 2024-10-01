#pragma once

#include <reanimated/CSS/easing/EasingFunctions.h>

#include <chrono>
#include <optional>

namespace reanimated {

enum class ProgressState {
  PENDING, // When the animation is waiting for the delay to pass
  RUNNING,
  PAUSED, // For css animations only
  FINISHED
};

class ProgressProvider {
 public:
  ProgressProvider(
      double duration,
      double delay,
      EasingFunction easingFunction);

  double getCurrent() const {
    return currentProgress.value_or(0);
  }

  std::optional<double> getPrevious() const {
    return previousProgress;
  }
  bool getStartTime() const {
    return startTime;
  }
  double getDelay() const {
    return delay;
  }
  ProgressState getState() const {
    return state;
  }

  bool hasDirectionChanged() const;

  void start(time_t timestamp);
  virtual void reset(time_t timestamp);
  void update(time_t timestamp);

 protected:
  const double duration;
  const double delay;
  const EasingFunction easingFunction;

  ProgressState state = ProgressState::PENDING;
  time_t startTime = 0;
  time_t currentTimestamp = 0;
  // These progress values are resulting progress returned by the `get` method
  // with all adjustments, such as easing, applied
  std::optional<double> currentProgress;
  std::optional<double> previousProgress;
  std::optional<double> previousToPreviousProgress;

  /**
   * Calculates the progress of the animation at the given timestamp without
   * applying any decorations (e.g. animation direction, easing)
   */
  virtual std::optional<double> calculateRawProgress(time_t timestamp) = 0;

  /**
   * Decorates the calculated progress with additional information when
   * necessary (e.g. animation direction). Easing will be applied automatically.
   */
  virtual double decorateProgress(double progress) const {
    return progress;
  }

 private:
  std::optional<double> calculateProgress(time_t timestamp);
};

} // namespace reanimated
