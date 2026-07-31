import { colors, radius, spacing } from "@/constants/theme";
import { useEffect, useRef } from "react";
import {
    Animated,
    DimensionValue,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

interface SkeletonBlockProps {
  width?: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonBlock({
  width = "100%",
  height,
  borderRadius = radius.md,
  style,
}: SkeletonBlockProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.block,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface TransactionListSkeletonProps {
  count?: number;
}

export function TransactionListSkeleton({
  count = 5,
}: TransactionListSkeletonProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.transactionRow}>
          <SkeletonBlock
            width={44}
            height={44}
            borderRadius={22}
            style={styles.icon}
          />

          <View style={styles.transactionText}>
            <SkeletonBlock width="62%" height={14} />
            <SkeletonBlock width="40%" height={10} />
          </View>

          <SkeletonBlock width={72} height={16} />
        </View>
      ))}
    </View>
  );
}

export function BalanceCardSkeleton() {
  return (
    <View style={styles.balanceCard}>
      <SkeletonBlock width={90} height={12} style={styles.balanceBlock} />

      <SkeletonBlock
        width={180}
        height={34}
        borderRadius={radius.sm}
        style={styles.balanceBlock}
      />

      <View style={styles.balanceBottom}>
        <SkeletonBlock width={100} height={12} style={styles.balanceBlock} />

        <SkeletonBlock width={80} height={12} style={styles.balanceBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.cardAlt,
  },

  list: {
    gap: spacing.sm,
  },

  transactionRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  icon: {
    backgroundColor: colors.peach,
  },

  transactionText: {
    flex: 1,
    gap: spacing.sm,
  },

  balanceCard: {
    minHeight: 150,
    padding: spacing.lg,
    justifyContent: "space-between",
    backgroundColor: colors.terracotta,
    borderRadius: radius.lg,
  },

  balanceBlock: {
    backgroundColor: "rgba(255,255,255,0.32)",
  },

  balanceBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
