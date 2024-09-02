import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

type GroupProps = PropsWithChildren<{
  bordered?: boolean;
  withMargin?: boolean;
  center?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export default function Group({
  bordered,
  center,
  children,
  style,
  withMargin = true,
}: GroupProps) {
  return (
    <View
      style={[
        styles.group,
        bordered && styles.bordered,
        center && styles.center,
        withMargin && styles.margin,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bordered: {
    borderColor: colors.foreground3,
    borderRadius: radius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: {
    backgroundColor: colors.background1,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  margin: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.sm,
  },
});
