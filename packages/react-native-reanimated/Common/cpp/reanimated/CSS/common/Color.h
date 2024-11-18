#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/common/definitions.h>

#include <worklets/Tools/JSISerializer.h>

#include <string>

namespace reanimated {

using namespace facebook;
using namespace worklets;

enum class ColorType {
  RGBA,
  TRANSPARENT,
};

class Color {
 public:
  Color();
  explicit Color(uint8_t r, uint8_t g, uint8_t b, uint8_t a);
  explicit Color(uint8_t r, uint8_t g, uint8_t b);
  explicit Color(const ColorArray &colorArray);
  explicit Color(jsi::Runtime &rt, const jsi::Value &value);

  static const Color Transparent;

  jsi::Value toJSIValue(jsi::Runtime &rt) const;
  std::string toString() const;
  Color interpolate(const Color &to, double progress) const;

 private:
  ColorArray channels;
  ColorType type;

  explicit Color(ColorType colorType) : channels{0, 0, 0, 0}, type(colorType) {}

  static uint8_t interpolateChannel(uint8_t from, uint8_t to, double progress);
};

inline const Color Color::Transparent(ColorType::TRANSPARENT);

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
