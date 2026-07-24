import { colors, spacing, typography } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path } from "react-native-svg";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Svg width={96} height={96} viewBox="0 0 96 96">
        <Ellipse cx="48" cy="54" rx="30" ry="32" fill={colors.peach} />
        <Path d="M24 26 L30 12 L38 24 Z" fill={colors.peach} />
        <Path d="M72 26 L66 12 L58 24 Z" fill={colors.peach} />
        <Ellipse
          cx="22"
          cy="58"
          rx="8"
          ry="16"
          fill={colors.terracotta}
          opacity={0.5}
        />
        <Ellipse
          cx="74"
          cy="58"
          rx="8"
          ry="16"
          fill={colors.terracotta}
          opacity={0.5}
        />
        <Circle cx="36" cy="48" r="11" fill={colors.white} />
        <Circle cx="60" cy="48" r="11" fill={colors.white} />
        <Circle cx="36" cy="48" r="4.5" fill={colors.charcoal} />
        <Circle cx="60" cy="48" r="4.5" fill={colors.charcoal} />
        <Circle
          cx="36"
          cy="48"
          r="13"
          fill="none"
          stroke={colors.terracotta}
          strokeWidth="2.5"
        />
        <Circle
          cx="60"
          cy="48"
          r="13"
          fill="none"
          stroke={colors.terracotta}
          strokeWidth="2.5"
        />
        <Line
          x1="49"
          y1="48"
          x2="47"
          y2="48"
          stroke={colors.terracotta}
          strokeWidth="2.5"
        />
        <Path d="M45 60 L51 60 L48 68 Z" fill={colors.terracotta} />
      </Svg>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.textMuted,
    textAlign: "center",
  },
});
