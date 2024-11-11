'use strict';
import { ReanimatedError } from '../../../errors';
import type { StyleProps } from '../../../commonTypes';
import {
  isAnimationSetting,
  isColorProp,
  isTransformString,
  isTransitionSetting,
} from '../../utils';
import { normalizeTransformString } from './transformString';
import { processColor } from '../../../Colors';
import { normalizeTransformOrigin } from './transformOrigin';
import type {
  CSSAnimationConfig,
  CSSTransitionConfig,
  CSSAnimationKeyframes,
  CSSTransitionProperty,
  Maybe,
} from '../../types';

export const ERROR_MESSAGES = {
  invalidColor: (color: Maybe<number | string>) =>
    `Invalid color value: ${color}`,
  unsupportedAspectRatio: (ratio: string | number) =>
    `Unsupported aspect ratio: ${ratio}. Expected a number or a string in "a/b" format.`,
};
type PropertyName = keyof StyleProps;

function normalizeColor(value: string | number) {
  let normalizedColor: Maybe<number | string> = null;

  if (typeof value === 'string') {
    if (value !== 'transparent') {
      normalizedColor = processColor(value, false);
    }
  } else {
    // case of number format 0xRRGGBBAA format needs to be re-formatted
    normalizedColor = processColor(
      `#${value.toString(16).padStart(8, '0')}`,
      false
    );
  }

  if (!normalizedColor && normalizedColor !== 0) {
    throw new ReanimatedError(ERROR_MESSAGES.invalidColor(value));
  }

  return normalizedColor;
}

function normalizeAspectRatio(value: string | number): number {
  if (typeof value === 'number' || !isNaN(+value)) {
    return +value;
  } else if (typeof value === 'string') {
    const parts = value.split('/');
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
  }

  throw new ReanimatedError(ERROR_MESSAGES.unsupportedAspectRatio(value));
}

export function normalizeStyle(style: StyleProps): StyleProps {
  const entries: [PropertyName, StyleProps[PropertyName]][] = [];

  for (const [key, value] of Object.entries(style)) {
    let propValue = value;

    if (value === 'auto') {
      propValue = undefined;
    } else if (isColorProp(key, propValue)) {
      entries.push([key, normalizeColor(propValue)]);
    } else if (isTransformString(key, propValue)) {
      entries.push([key, normalizeTransformString(propValue)]);
    } else {
      switch (key) {
        case 'transformOrigin':
          entries.push([key, normalizeTransformOrigin(propValue)]);
          break;
        case 'gap':
          entries.push(['rowGap', propValue], ['columnGap', propValue]);
          break;
        case 'aspectRatio':
          entries.push([key, normalizeAspectRatio(propValue)]);
          break;
        default:
          entries.push([key, propValue]);
      }
    }
  }

  return Object.fromEntries(entries);
}

export function extractCSSConfigsAndFlattenedStyles(
  styles: StyleProps[]
): [CSSAnimationConfig | null, CSSTransitionConfig | null, StyleProps] {
  let animationName: CSSAnimationKeyframes | null = null;
  let transitionProperty: CSSTransitionProperty | null = null;
  const animationConfig: Partial<CSSAnimationConfig> = {};
  const transitionConfig: Partial<CSSTransitionConfig> = {};
  const flattenedStyle: StyleProps = {};

  for (const style of styles) {
    for (const prop in style) {
      const value = style[prop];
      if (prop === 'animationName') {
        animationName = value as CSSAnimationKeyframes;
      } else if (prop === 'transitionProperty') {
        transitionProperty = value as CSSTransitionProperty;
      } else if (isAnimationSetting(prop)) {
        animationConfig[prop] = value;
      } else if (isTransitionSetting(prop)) {
        transitionConfig[prop] = value;
      } else {
        flattenedStyle[prop] = value;
      }
    }
  }

  // Return animationConfig only if the animationName is present
  const hasAnimationName =
    animationName &&
    typeof animationName === 'object' &&
    Object.keys(animationName).length > 0;
  const finalAnimationConfig = hasAnimationName
    ? ({ ...animationConfig, animationName } as CSSAnimationConfig)
    : null;

  // Return transitionConfig only if the transitionProperty is present
  const hasTransitionConfig = Array.isArray(transitionProperty)
    ? transitionProperty.length > 0
    : !!transitionProperty;
  const finalTransitionConfig = hasTransitionConfig
    ? ({ ...transitionConfig, transitionProperty } as CSSTransitionConfig)
    : null;

  return [
    finalAnimationConfig,
    finalTransitionConfig,
    normalizeStyle(flattenedStyle),
  ];
}
