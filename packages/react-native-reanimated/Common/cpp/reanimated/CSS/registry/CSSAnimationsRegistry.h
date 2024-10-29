#pragma once

#include <reanimated/CSS/core/CSSAnimation.h>
#include <reanimated/Fabric/updates/UpdatesRegistry.h>

#include <memory>
#include <queue>
#include <utility>

namespace reanimated {

enum class AnimationOperation { ACTIVATE, DEACTIVATE, FINISH };

class CSSAnimationsRegistry : public UpdatesRegistry {
 public:
  bool hasUpdates() const {
    return !runningAnimationIds_.empty() || !delayedAnimationIds_.empty() ||
        !operationsBatch_.empty();
  }

  void updateSettings(
      unsigned id,
      const PartialCSSAnimationSettings &updatedSettings,
      double timestamp);

  void add(
      jsi::Runtime &rt,
      const std::shared_ptr<CSSAnimation> &animation,
      double timestamp);
  void remove(unsigned id);
  void update(jsi::Runtime &rt, double timestamp);

 private:
  using Registry = std::unordered_map<unsigned, std::shared_ptr<CSSAnimation>>;
  using OperationsBatch = std::vector<std::pair<AnimationOperation, unsigned>>;
  using DelayedQueue = std::priority_queue<
      std::pair<time_t, unsigned>,
      std::vector<std::pair<time_t, unsigned>>,
      std::greater<std::pair<time_t, unsigned>>>;

  Registry registry_;
  OperationsBatch operationsBatch_;

  std::unordered_set<unsigned> runningAnimationIds_;
  std::unordered_set<unsigned> delayedAnimationIds_;
  DelayedQueue delayedAnimationsQueue_;

  void activateDelayedAnimations(double timestamp);
  void flushOperations(jsi::Runtime &rt, double timestamp);

  jsi::Value handleUpdate(
      jsi::Runtime &rt,
      double timestamp,
      const std::shared_ptr<CSSAnimation> &item);
  void handleOperation(
      jsi::Runtime &rt,
      AnimationOperation operation,
      const std::shared_ptr<CSSAnimation> &item,
      double timestamp);

  void activateOperation(const unsigned id);
  void deactivateOperation(
      const std::shared_ptr<CSSAnimation> &animation,
      double timestamp);
  void finishOperation(
      jsi::Runtime &rt,
      const std::shared_ptr<CSSAnimation> &animation,
      double timestamp);
};

} // namespace reanimated
