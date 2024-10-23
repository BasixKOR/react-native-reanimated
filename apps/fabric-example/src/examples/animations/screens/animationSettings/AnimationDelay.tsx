import { StyleSheet, View } from 'react-native';
import type { CSSAnimationConfig } from 'react-native-reanimated';
import { sizes, colors, radius } from '../../../../theme';
import Animated from 'react-native-reanimated';
import { ExampleScreen } from './components';

export default function AnimationDelay() {
  const config: CSSAnimationConfig = {
    animationName: {
      from: {
        width: 0,
      },
    },
    animationDuration: '3s',
    animationFillMode: 'backwards',
    animationTimingFunction: 'linear',
  };

  const renderExample = (exampleConfig: CSSAnimationConfig) => (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.box, exampleConfig]} />
    </View>
  );

  return (
    <ExampleScreen
      config={config}
      renderExample={renderExample}
      cards={[
        {
          title: 'Positive Delay',
          items: [
            { label: '0s (default)' },
            { animationDelay: '500ms', label: '500ms' },
            { animationDelay: '2s', label: '2s' },
            { animationDelay: 3500, label: '3500' },
          ],
        },
        {
          title: 'Negative Delay',
          description:
            'A negative value causes the animation to begin immediately, but partway through its cycle. For example, if you specify -1s as the animation delay time, the animation will begin immediately but will start 1 second into the animation sequence.',
          items: [
            { label: '0s (default)' },
            { animationDelay: '-500ms', label: '-500ms' },
            { animationDelay: '-1s', label: '-1s' },
            { animationDelay: -3000, label: '-3000' },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: sizes.sm,
  },
  wrapper: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
