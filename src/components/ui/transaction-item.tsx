import { colors, radius, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

interface TransactionItemProps {
  icon: string;
  title: string;
  subtitle: string;
  amount: number;
  type: "income" | "expense";
  onDelete?: () => void;
}

export function TransactionItem({
  icon,
  title,
  subtitle,
  amount,
  type,
  onDelete,
}: TransactionItemProps) {
  const swipeableRef = useRef<React.ComponentRef<typeof Swipeable>>(null);
  const isExpense = type === "expense";
  const formatted =
    "₺" +
    Math.abs(amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 });

  const renderRightActions = (progress: SharedValue<number>) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [0.6, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }));

    return (
      <Animated.View style={[styles.deleteAction, animatedStyle]}>
        <Ionicons
          name="trash-outline"
          size={20}
          color={colors.white}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.();
          }}
        />
      </Animated.View>
    );
  };

  const content = (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: isExpense ? colors.terracotta : colors.sage },
        ]}
      >
        {isExpense ? "-" : "+"}
        {formatted}
      </Text>
    </View>
  );

  if (!onDelete) return content;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      {content}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.peach,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20 },
  textGroup: { flex: 1, gap: 2 },
  title: {
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.textMuted,
  },
  amount: {
    fontSize: typography.bodyLarge.fontSize,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  deleteAction: {
    backgroundColor: colors.terracotta,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
});
