import type { PropsWithChildren } from 'react';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, sizes, spacing, text } from '../../theme';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export type ExpandableCardProps = PropsWithChildren<{
  expanded: boolean;
  onChange?: (expanded: boolean) => void;
  showExpandOverlay?: boolean;
  overlayHeight?: number;
  style?: StyleProp<ViewStyle>;
}>;

export default function ExpandableCard({
  onChange,
  expanded,
  children,
  showExpandOverlay,
  overlayHeight = sizes.lg,
  style,
}: ExpandableCardProps) {
  const animatedGradientStyle = useAnimatedStyle(() => ({
    opacity: withTiming(+!expanded),
  }));

  return (
    <Animated.View
      layout={LinearTransition}
      style={[
        styles.container,
        { paddingBottom: showExpandOverlay ? spacing.lg : spacing.sm },
        style,
      ]}>
      {children}

      {/* Overlay */}
      {showExpandOverlay && (
        <Animated.View
          style={[styles.overlay, { height: overlayHeight }]}
          layout={LinearTransition}>
          <Animated.View style={[styles.gradient, animatedGradientStyle]}>
            <Svg height={overlayHeight} width="100%">
              <Defs>
                <LinearGradient
                  id="vertical-gradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1">
                  <Stop
                    offset="0"
                    stopColor={colors.background1}
                    stopOpacity="0"
                  />
                  <Stop
                    offset="0.8"
                    stopColor={colors.background1}
                    stopOpacity="1"
                  />
                </LinearGradient>
              </Defs>

              <Rect fill="url(#vertical-gradient)" height="100%" width="100%" />
            </Svg>
          </Animated.View>

          {/* Expand/Collapse button */}
          <TouchableOpacity
            onPress={() => onChange?.(!expanded)}
            style={styles.expandButton}>
            <FontAwesomeIcon
              icon={expanded ? faChevronUp : faChevronDown}
              size={sizes.xxxs}
              color={colors.primary}
            />
            <Text style={styles.expandButtonText}>
              {expanded ? 'Collapse' : 'Expand'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  expandButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  expandButtonText: {
    ...text.label2,
    color: colors.primary,
  },
});
