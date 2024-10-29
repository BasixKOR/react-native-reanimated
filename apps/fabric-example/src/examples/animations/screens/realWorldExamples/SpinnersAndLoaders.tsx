/**
 * The original CSS implementation of this example can be found here:
 * https://codepen.io/Ferie/pen/wQMvXV?editors=1100
 */

import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../../../theme';
import type { ComponentType } from 'react';
import React from 'react';
import {
  Grid as GridLayout,
  ScrollScreen,
  Stagger,
  Text,
} from '../../../../components';
import type {
  CSSAnimationConfig,
  CSSAnimationKeyframes,
  CSSAnimationSettings,
} from 'react-native-reanimated';
import Animated, { cubicBezier } from 'react-native-reanimated';

const SPINNER_SIZE = 60;

export default function SpinnersAndLoaders() {
  return (
    <ScrollScreen contentContainerStyle={{ paddingVertical: spacing.lg }}>
      <GridLayout
        columns={3}
        staggerInterval={100}
        columnGap={spacing.sm}
        rowGap={spacing.md}>
        <Example title="Spinner" Component={Spinner} />
        <Example title="Ring" Component={Ring} />
        <Example title="Roller" Component={Roller} />
        <Example title="Default" Component={Default} />
        <Example title="Ellipsis" Component={Ellipsis} />
        <Example title="Grid" Component={Grid} />
        <Example title="Ripple" Component={Ripple} />
        <Example title="Dual Ring" Component={DualRing} />
        <Example title="Rectangle Bounce" Component={RectangleBounce} />
        <Example title="Pulse" Component={Pulse} />
        <Example title="Double Pulse" Component={DoublePulse} />
        <Example title="Rectangle" Component={Rectangle} />
        <Example title="Three Dots" Component={ThreeDots} />
        <Example title="Cubes" Component={Cubes} />
        <Example title="Diamond" Component={Diamond} />
      </GridLayout>
    </ScrollScreen>
  );
}

type ExampleProps = {
  title: string;
  Component: ComponentType;
};

function Example({ title, Component }: ExampleProps) {
  return (
    <View style={sharedStyles.cell}>
      <Stagger delay={50}>
        <Component />
        <Text variant="label2" center>
          {title}
        </Text>
      </Stagger>
    </View>
  );
}

const sharedStyles = StyleSheet.create({
  loader: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
  },
  cell: {
    backgroundColor: colors.background1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    gap: spacing.sm,
    width: '100%',
    flex: 1,
  },
});

function Spinner() {
  return (
    <View style={sharedStyles.loader}>
      {Array.from({ length: 12 }).map((_, index) => (
        <View
          key={index}
          style={[
            spinnerStyles.barWrapper,
            {
              transform: [
                { rotate: `${index * 30}deg` },
                { translateY: '-50%' },
                { translateX: '-50%' },
              ],
            },
          ]}>
          <Animated.View
            style={[
              spinnerStyles.bar,
              {
                animationName: {
                  to: {
                    opacity: 0,
                  },
                },
                animationDuration: '1.2s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: `${-(11 - index) / 10}s`,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const spinnerStyles = StyleSheet.create({
  barWrapper: {
    transformOrigin: '0 0',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  bar: {
    borderRadius: SPINNER_SIZE,
    height: (1 / 6) * SPINNER_SIZE,
    width: (1 / 12) * SPINNER_SIZE,
    backgroundColor: colors.primary,
    top: 0.4 * SPINNER_SIZE,
  },
});

function Ring() {
  return (
    <View style={sharedStyles.loader}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            ringStyles.part,
            {
              animationName: {
                to: {
                  transform: [{ rotate: '360deg' }],
                },
              },
              animationDuration: '1.2s',
              animationTimingFunction: cubicBezier(0.5, 0, 0.5, 1),
              animationIterationCount: 'infinite',
              animationDelay: `${-0.15 * (index + 1)}s`,
            },
          ]}
        />
      ))}
    </View>
  );
}

const ringStyles = StyleSheet.create({
  part: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: 0.1 * SPINNER_SIZE,
    borderColor: 'rgba(0, 0, 0, 0.01)',
    borderBlockStartColor: colors.primary,
  },
});

function Roller() {
  const DOT_COUNT = 8;

  return (
    <View style={sharedStyles.loader}>
      {Array.from({ length: DOT_COUNT }).map((_, index) => {
        const startOffset = (index - (DOT_COUNT - 1) / 2) * 15;

        return (
          <Animated.View
            key={index}
            style={[
              rollerStyles.dotWrapper,
              {
                transform: [{ rotate: `${startOffset}deg` }],
                animationName: {
                  to: {
                    transform: [{ rotate: `${360 + startOffset}deg` }],
                  },
                },
                animationDuration: '1.2s',
                animationDelay: `${-0.036 * (index + 1)}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: cubicBezier(0.5, 0, 0.5, 1),
              },
            ]}>
            <View style={[rollerStyles.dot]} />
          </Animated.View>
        );
      })}
    </View>
  );
}

const rollerStyles = StyleSheet.create({
  dotWrapper: {
    transformOrigin: '0 0',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  dot: {
    width: 0.1 * SPINNER_SIZE,
    height: 0.1 * SPINNER_SIZE,
    borderRadius: '50%',
    top: 0.4 * SPINNER_SIZE,
    backgroundColor: colors.primary,
  },
});

function Default() {
  return (
    <View style={sharedStyles.loader}>
      {Array.from({ length: 12 }).map((_, index) => (
        <View
          key={index}
          style={[
            defaultStyles.dotWrapper,
            {
              transform: [
                { rotate: `${index * 30}deg` },
                { translateY: '-50%' },
                { translateX: '-50%' },
              ],
            },
          ]}>
          <Animated.View
            style={[
              defaultStyles.dot,
              {
                animationName: {
                  '0%': {
                    transform: [{ scale: 1 }],
                  },
                  '20%': {
                    transform: [{ scale: 1 }],
                  },
                  '80%': {
                    transform: [{ scale: 1 }],
                  },
                  '100%': {
                    transform: [{ scale: 1 }],
                  },
                  '50%': {
                    transform: [{ scale: 1.5 }],
                  },
                },
                animationDuration: '1.2s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: `${-(11 - index) / 10}s`,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  dotWrapper: {
    transformOrigin: '0 0',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  dot: {
    width: 0.1 * SPINNER_SIZE,
    height: 0.1 * SPINNER_SIZE,
    borderRadius: '50%',
    top: 0.4 * SPINNER_SIZE,
    backgroundColor: colors.primary,
  },
});

function Ellipsis() {
  const ellipsis1: CSSAnimationKeyframes = {
    from: {
      transform: [{ scale: 0 }],
    },
  };

  const ellipsis2: CSSAnimationKeyframes = {
    to: {
      transform: [{ translateX: 0.3 * SPINNER_SIZE }],
    },
  };

  const ellipsis3: CSSAnimationKeyframes = {
    to: {
      transform: [{ scale: 0 }],
    },
  };

  const animationSettings: CSSAnimationSettings = {
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
    animationTimingFunction: cubicBezier(0.5, 0, 0.5, 1),
  };

  return (
    <View style={sharedStyles.loader}>
      <Animated.View
        style={[
          ellipsisStyles.dot,
          {
            left: 0.1 * SPINNER_SIZE,
            animationName: ellipsis1,
            ...animationSettings,
          },
        ]}
      />
      <Animated.View
        style={[
          ellipsisStyles.dot,
          {
            left: 0.1 * SPINNER_SIZE,
            animationName: ellipsis2,
            ...animationSettings,
          },
        ]}
      />
      <Animated.View
        style={[
          ellipsisStyles.dot,
          {
            left: 0.4 * SPINNER_SIZE,
            animationName: ellipsis2,
            ...animationSettings,
          },
        ]}
      />
      <Animated.View
        style={[
          ellipsisStyles.dot,
          {
            left: 0.7 * SPINNER_SIZE,
            animationName: ellipsis3,
            ...animationSettings,
          },
        ]}
      />
    </View>
  );
}

const ellipsisStyles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: 0.4 * SPINNER_SIZE,
    width: 0.2 * SPINNER_SIZE,
    height: 0.2 * SPINNER_SIZE,
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
});

function Grid() {
  return (
    <View style={gridStyles.grid}>
      {Array.from({ length: 9 }).map((_, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;
        const delay = -0.4 * (row + column);

        return (
          <Animated.View
            key={index}
            style={[
              gridStyles.dot,
              {
                animationName: {
                  '50%': {
                    opacity: 0.5,
                  },
                },
                animationDuration: '1.2s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: `${delay}s`,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const gridStyles = StyleSheet.create({
  grid: {
    ...sharedStyles.loader,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0.0875 * SPINNER_SIZE,
  },
  dot: {
    width: 0.275 * SPINNER_SIZE,
    height: 0.275 * SPINNER_SIZE,
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
});

function Ripple() {
  const ripple: CSSAnimationKeyframes = {
    from: {
      opacity: 1,
      width: 0,
      height: 0,
    },
    to: {
      opacity: 0,
      width: SPINNER_SIZE,
      height: SPINNER_SIZE,
    },
  };

  const animationSettings: CSSAnimationSettings = {
    animationDuration: '1s',
    animationTimingFunction: cubicBezier(0, 0.2, 0.8, 1),
    animationIterationCount: 'infinite',
  };

  return (
    <View style={sharedStyles.loader}>
      <Animated.View
        style={[
          rippleStyles.ripple,
          {
            animationName: ripple,
            ...animationSettings,
          },
        ]}
      />
      <Animated.View
        style={[
          rippleStyles.ripple,
          {
            animationName: ripple,
            ...animationSettings,
            animationDelay: '-0.5s',
          },
        ]}
      />
    </View>
  );
}

const rippleStyles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    borderWidth: 0.05 * SPINNER_SIZE,
    borderRadius: '50%',
    left: '50%',
    top: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    borderColor: colors.primary,
  },
});

function DualRing() {
  return (
    <View style={sharedStyles.loader}>
      <Animated.View
        style={[
          dualRingStyles.part,
          {
            animationName: {
              to: {
                transform: [{ rotate: '180deg' }],
              },
            },
            animationDuration: '0.6s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          },
        ]}
      />
    </View>
  );
}

const dualRingStyles = StyleSheet.create({
  part: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: 0.1 * SPINNER_SIZE,
    borderColor: 'rgba(0, 0, 0, 0.01)',
    borderBlockStartColor: colors.primary,
    borderBlockEndColor: colors.primary,
  },
});

function RectangleBounce() {
  return (
    <View style={RectangleBounceStyles.loader}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            RectangleBounceStyles.bar,
            {
              animationName: {
                '0%': {
                  transform: [{ scaleY: 0.4 }],
                },
                '20%': {
                  transform: [{ scaleY: 1 }],
                },
                '40%': {
                  transform: [{ scaleY: 0.4 }],
                },
                '100%': {
                  transform: [{ scaleY: 0.4 }],
                },
              },
              animationDuration: '1.5s',
              animationTimingFunction: 'easeInOut',
              animationIterationCount: 'infinite',
              animationDelay: `${-1.5 + 0.1 * index}s`,
            },
          ]}
        />
      ))}
    </View>
  );
}

const RectangleBounceStyles = StyleSheet.create({
  loader: {
    ...sharedStyles.loader,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bar: {
    width: '15%',
    height: '75%',
    backgroundColor: colors.primary,
  },
});

function Pulse() {
  return (
    <View style={sharedStyles.loader}>
      <Animated.View
        style={[
          pulseStyles.pulse,
          {
            animationName: {
              from: {
                transform: [{ scale: 0 }],
                opacity: 0.8,
              },
              to: {
                opacity: 0,
              },
            },
            animationDuration: '1.5s',
            animationTimingFunction: 'easeOut',
            animationIterationCount: 'infinite',
          },
        ]}
      />
    </View>
  );
}

const pulseStyles = StyleSheet.create({
  pulse: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
});

function DoublePulse() {
  const pulse: CSSAnimationConfig = {
    animationName: {
      from: {
        transform: [{ scale: 0 }],
      },
      to: {
        opacity: 0,
      },
    },
    animationDuration: '1.5s',
    animationTimingFunction: 'easeOut',
    animationIterationCount: 'infinite',
  };

  return (
    <View style={sharedStyles.loader}>
      <Animated.View style={[doublePulseStyles.pulse, pulse]} />
      <Animated.View
        style={[
          doublePulseStyles.pulse,
          pulse,
          {
            animationDelay: '-350ms',
          },
        ]}
      />
    </View>
  );
}

const doublePulseStyles = StyleSheet.create({
  pulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
});

function Rectangle() {
  return (
    <View style={rectangleStyles.loader}>
      <Animated.View
        style={[
          rectangleStyles.rectangle,
          {
            animationName: {
              from: {
                transform: [{ perspective: 2 * SPINNER_SIZE }],
              },
              '50%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateX: '-180deg' },
                ],
              },
              to: {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateX: '-180deg' },
                  { rotateY: '-180deg' },
                ],
              },
            },
            animationDuration: '1.2s',
            animationTimingFunction: 'easeInOut',
            animationIterationCount: 'infinite',
          },
        ]}
      />
    </View>
  );
}

const rectangleStyles = StyleSheet.create({
  loader: {
    ...sharedStyles.loader,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangle: {
    width: '75%',
    height: '75%',
    backgroundColor: colors.primary,
  },
});

function ThreeDots() {
  return (
    <View style={threeDotsStyles.loader}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            threeDotsStyles.dot,
            {
              animationName: {
                '0%': {
                  transform: [{ scale: 0 }],
                },
                '40%': {
                  transform: [{ scale: 1 }],
                },
                '80%': {
                  transform: [{ scale: 0 }],
                },
                '100%': {
                  transform: [{ scale: 0 }],
                },
              },
              animationDuration: '1.5s',
              animationTimingFunction: 'easeInOut',
              animationIterationCount: 'infinite',
              animationDelay: `${-0.16 * (2 - index)}s`,
            },
          ]}
        />
      ))}
    </View>
  );
}

const threeDotsStyles = StyleSheet.create({
  loader: {
    ...sharedStyles.loader,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dot: {
    width: 0.25 * SPINNER_SIZE,
    height: 0.25 * SPINNER_SIZE,
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
});

function Cubes() {
  return (
    <View style={cubesStyles.loader}>
      {Array.from({ length: 9 }).map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        const diagonal = col - row + 2;
        const delay = diagonal / 10;

        return (
          <Animated.View
            key={index}
            style={[
              cubesStyles.cube,
              {
                animationName: {
                  '0%': {
                    transform: [{ scale: 1 }],
                  },
                  '35%': {
                    transform: [{ scale: 0 }],
                  },
                  '70%': {
                    transform: [{ scale: 1 }],
                  },
                  '100%': {
                    transform: [{ scale: 1 }],
                  },
                },
                animationDuration: '1.5s',
                animationTimingFunction: 'easeInOut',
                animationIterationCount: 'infinite',
                animationDelay: `${delay}s`,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const cubesStyles = StyleSheet.create({
  loader: {
    ...sharedStyles.loader,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cube: {
    width: (1 / 3) * SPINNER_SIZE,
    height: (1 / 3) * SPINNER_SIZE,
    backgroundColor: colors.primary,
  },
});

function Diamond() {
  const renderPart = (order: number) => (
    <View
      key={order}
      style={[
        diamondStyles.partWrapper,
        {
          transform: [{ rotateZ: `${order * 90}deg` }, { scale: 1.1 }],
        },
      ]}>
      <Animated.View
        style={[
          diamondStyles.part,
          {
            animationName: {
              '0%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateX: '-180deg' },
                ],
                opacity: 0,
              },
              '10%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateX: '-180deg' },
                ],
                opacity: 0,
              },
              '25%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateX: '0deg' },
                ],
                opacity: 1,
              },
              '75%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateX: '0deg' },
                ],
                opacity: 1,
              },
              '90%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateY: '180deg' },
                ],
                opacity: 0,
              },
              '100%': {
                transform: [
                  { perspective: 2 * SPINNER_SIZE },
                  { rotateY: '180deg' },
                ],
                opacity: 0,
              },
            },
            animationDuration: '2.4s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationDelay: `${-0.3 * (4 - order)}s`,
          },
        ]}
      />
    </View>
  );

  return (
    <View style={diamondStyles.loader}>
      <View style={diamondStyles.diamond}>
        {renderPart(0)}
        {renderPart(1)}
        {renderPart(3)}
        {renderPart(2)}
      </View>
    </View>
  );
}

const DIAMOND_SIZE = (SPINNER_SIZE * Math.sqrt(2)) / 2;

const diamondStyles = StyleSheet.create({
  loader: {
    ...sharedStyles.loader,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamond: {
    width: DIAMOND_SIZE,
    height: DIAMOND_SIZE,
    transform: [{ rotate: '45deg' }],
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  partWrapper: {
    width: '50%',
    height: '50%',
  },
  part: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    transformOrigin: '100% 100%',
  },
});
