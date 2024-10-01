#pragma once

#include <reanimated/Fabric/ShadowTreeCloner.h>

#include <react/renderer/core/ShadowNode.h>

#include <jsi/jsi.h>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace reanimated {

using namespace facebook;
using namespace react;

using UpdatesBatch =
    std::vector<std::pair<ShadowNode::Shared, std::unique_ptr<jsi::Value>>>;

using RegistryMap =
    std::unordered_map<Tag, std::pair<ShadowNode::Shared, folly::dynamic>>;

class UpdatesRegistry {
 public:
  void flushUpdates(jsi::Runtime &rt, UpdatesBatch &updatesBatch);
  void collectProps(PropsMap &propsMap);
  folly::dynamic get(Tag tag) const;

 protected:
  UpdatesBatch updatesBatch_;
  std::unordered_set<Tag> tagsToRemove_;
  RegistryMap updatesRegistry_;

  void flushUpdatesToRegistry(jsi::Runtime &rt, UpdatesBatch &updatesBatch);

 private:
  mutable std::mutex mutex_;

  void runMarkedRemovals();
};

} // namespace reanimated
