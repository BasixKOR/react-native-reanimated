#include <reanimated/CSS/core/CSSTransition.h>

namespace reanimated {

CSSTransition::CSSTransition(
    const ShadowNode::Shared shadowNode,
    const CSSTransitionConfig &config,
    const std::shared_ptr<ViewStylesRepository> &viewStylesRepository)
    : shadowNode_(shadowNode),
      properties_(config.properties),
      viewStylesRepository_(viewStylesRepository),
      styleInterpolator_(TransitionStyleInterpolator(viewStylesRepository)),
      progressProvider_(TransitionProgressProvider(
          config.duration,
          config.delay,
          config.easingFunction)) {}

void CSSTransition::updateSettings(
    jsi::Runtime &rt,
    const PartialCSSTransitionSettings &settings) {
  if (settings.properties.has_value()) {
    updateTransitionProperties(settings.properties.value());
  }
  // TODO update other settings
}

jsi::Value CSSTransition::run(
    jsi::Runtime &rt,
    const ChangedProps &changedProps,
    const time_t timestamp) {
  styleInterpolator_.updateInterpolatedProperties(rt, changedProps);
  progressProvider_.runProgressProviders(
      rt, timestamp, changedProps.changedPropertyNames);
  // Call update to calculate current interpolation values
  // (e.g. to immediately apply final values for the 0 duration)
  return update(rt, timestamp);
}

jsi::Value CSSTransition::update(jsi::Runtime &rt, time_t timestamp) {
  progressProvider_.update(timestamp);

  auto updates = styleInterpolator_.update(
      rt, shadowNode_, progressProvider_.getPropertyProgressProviders());

  return updates;
}

void CSSTransition::updateTransitionProperties(
    const TransitionProperties &properties) {
  properties_ = properties;

  const auto isAllProperties = !properties_.has_value();
  if (isAllProperties) {
    return;
  }

  const std::unordered_set<std::string> transitionPropertyNames(
      properties_->begin(), properties_->end());
  styleInterpolator_.discardIrrelevantInterpolators(transitionPropertyNames);
  progressProvider_.discardIrrelevantProgressProviders(transitionPropertyNames);
}

} // namespace reanimated
