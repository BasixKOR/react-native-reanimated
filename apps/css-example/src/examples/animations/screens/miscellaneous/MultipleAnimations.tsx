import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import type {
  CSSAnimationKeyframes,
  CSSAnimationSettings,
} from 'react-native-reanimated';
import Animated, {
  cubicBezier,
  LinearTransition,
  steps,
} from 'react-native-reanimated';

import type { SelectableConfig } from '@/components';
import {
  Button,
  CodeBlock,
  ConfigSelector,
  CopyButton,
  ScrollScreen,
  Section,
  Stagger,
  Text,
  useSelectableConfig,
} from '@/components';
import { colors, flex, radius, sizes, spacing } from '@/theme';
import { stringifyConfig } from '@/utils';

const wiggleAnimation: CSSAnimationKeyframes = {
  '0, 100%': {
    transform: [{ rotate: '-15deg' }],
  },
  '50%': {
    transform: [{ rotate: '15deg' }],
  },
};

const opacityAnimation: CSSAnimationKeyframes = {
  to: {
    opacity: 0,
  },
};

const sizeAnimation: CSSAnimationKeyframes = {
  from: {
    height: sizes.xl,
    width: sizes.xl,
  },
};

const ANIMATIONS = [
  { animation: wiggleAnimation, name: 'Wiggle' },
  { animation: opacityAnimation, name: 'Opacity' },
  { animation: sizeAnimation, name: 'Size' },
];

const DEFAULT_ANIMATION_SETTINGS: SelectableConfig<CSSAnimationSettings> = {
  $animationDelay: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: ['0s', '1s', '2s'],
    value: ['0s', '1s'],
  },
  $animationDirection: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: ['normal', 'reverse', 'alternate', 'alternateReverse'],
    value: 'alternate',
  },
  $animationDuration: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: ['1s', '2s', '5s'],
    value: ['1s', '2s'],
  },
  $animationFillMode: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: ['none', 'forwards', 'backwards', 'both'],
    value: 'backwards',
  },
  $animationIterationCount: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: [1, 2, 5, 'infinite'],
    value: 'infinite',
  },
  $animationPlayState: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: ['running', 'paused'],
    value: 'running',
  },
  $animationTimingFunction: {
    canDisable: true,
    maxNumberOfValues: 3,
    options: [
      'linear',
      'easeInOut',
      steps(5),
      cubicBezier(0.175, 0.885, 0.32, 1.275),
    ],
    value: ['easeInOut', cubicBezier(0.175, 0.885, 0.32, 1.275)],
  },
};

export default function MultipleAnimations() {
  const [key, setKey] = useState(0);
  const [selectableSettings, setSelectableSettings] = useState(
    DEFAULT_ANIMATION_SETTINGS
  );
  const [selectedIndexes, setSelectedIndexes] = useState<Array<number>>([0, 2]);

  const animationSettings = useSelectableConfig(selectableSettings);
  const animation = {
    animationName: selectedIndexes.map((index) => ANIMATIONS[index].animation),
    ...animationSettings,
  };

  return (
    <ScrollScreen>
      <Stagger>
        <Section
          labelTypes={['new']}
          title="Multiple Animations"
          description="This example demonstrates how to apply **multiple animations** to a single element. It also allows selecting **separate animation settings** or **sharing them** across all animations if only a single value is set.
        ">
          <View style={styles.sectionGroup}>
            <View style={styles.buttonRow}>
              <Text variant="subHeading2">Select settings:</Text>
              <CopyButton
                onCopy={() => stringifyConfig(animationSettings, false)}
              />
            </View>
            <ConfigSelector
              blockStyle={styles.block}
              config={selectableSettings}
              dropdownStyle={styles.dropdown}
              onChange={setSelectableSettings}
            />
          </View>

          <View style={styles.sectionGroup}>
            <Text variant="subHeading2">Select animations:</Text>
            <Text>
              Animations will be applied in the **same order** as the **order of
              buttons**.
            </Text>
            <Text>
              You can see the complete config for the selected animations below,
              in the **Animation Configuration** section.
            </Text>
            <View style={styles.buttons}>
              {ANIMATIONS.map((item, index) => (
                <Button
                  key={index}
                  title={item.name}
                  style={[
                    flex.grow,
                    !selectedIndexes.includes(index) && styles.unselectedButton,
                  ]}
                  onPress={() =>
                    setSelectedIndexes((indexes) => {
                      if (indexes.includes(index)) {
                        return indexes.filter((i) => i !== index);
                      }
                      return [...indexes, index].sort();
                    })
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.buttonRows}>
            <View style={styles.buttonRow}>
              <Text variant="label1">Reset config</Text>
              <Button
                style={styles.button}
                title="Reset"
                onPress={() => {
                  setSelectableSettings(DEFAULT_ANIMATION_SETTINGS);
                  setSelectedIndexes([0, 1]);
                }}
              />
            </View>
            <View style={styles.buttonRow}>
              <Text variant="label1">Restart animation</Text>
              <Button
                style={styles.button}
                title="Restart"
                onPress={() => setKey((prev) => prev + 1)}
              />
            </View>
          </View>

          <View style={styles.preview}>
            <Animated.View key={key} style={[styles.box, animation]} />
          </View>
        </Section>

        <Section
          description="Selected animation configuration"
          title="Animation Configuration">
          <Animated.View layout={LinearTransition} style={styles.codeWrapper}>
            <CodeBlock code={stringifyConfig(animation, false)} />
          </Animated.View>
        </Section>
      </Stagger>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.xxs,
  },
  box: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: sizes.md,
    width: sizes.md,
  },
  button: {
    width: 75,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRows: {
    gap: spacing.xxxs,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    justifyContent: 'space-between',
  },
  codeWrapper: {
    backgroundColor: colors.background2,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
  dropdown: {
    maxWidth: Math.min(Dimensions.get('window').width - 2 * spacing.lg, 300),
  },
  preview: {
    ...flex.center,
    backgroundColor: colors.background2,
    borderRadius: radius.md,
    height: sizes.xxl,
  },
  sectionGroup: {
    gap: spacing.xs,
  },
  unselectedButton: {
    opacity: 0.5,
  },
});
