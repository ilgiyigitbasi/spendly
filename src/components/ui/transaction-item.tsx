import { colors, radius, spacing, typography } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface TransactionItemProps {
  icon: string; // emoji, örn. "🛒"
  title: string; // "Migros Market"
  subtitle: string; // "Bugün, 12:40 • Mutfak"
  amount: number;
  type: "income" | "expense";
}

export function TransactionItem({
  icon,
  title,
  subtitle,
  amount,
  type,
}: TransactionItemProps) {
  const isExpense = type === "expense";
  const formatted =
    "₺" +
    Math.abs(amount).toLocaleString("tr-TR", { minimumFractionDigits: 2 });

  return (
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
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white, // ya da daha da açık istersen "#FFFDFB" gibi sand'e çok yakın bir beyaz
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm, // kartlar arası boşluk
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.peach,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
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
});
