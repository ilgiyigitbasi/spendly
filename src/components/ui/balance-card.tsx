import { colors, radius, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface BalanceCardProps {
  balance: number;
  changePercent?: number; // örn. 12.4
}

export function BalanceCard({ balance, changePercent }: BalanceCardProps) {
  const formatted =
    "₺" + balance.toLocaleString("tr-TR", { minimumFractionDigits: 2 });
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <View style={styles.card}>
      <Svg
        width={110}
        height={110}
        viewBox="0 0 110 110"
        style={{ position: "absolute", top: -15, right: -15 }}
      >
        <Circle cx="80" cy="25" r="22" fill={colors.peach} opacity={0.3} />
        <Circle cx="55" cy="12" r="9" fill={colors.white} opacity={0.2} />
        <Circle cx="95" cy="55" r="7" fill={colors.white} opacity={0.12} />
        <Circle cx="40" cy="35" r="4" fill={colors.peach} opacity={0.35} />
      </Svg>
      <Text style={styles.label}>TOPLAM BAKİYE</Text>
      <Text style={styles.amount}>{formatted}</Text>
      {changePercent !== undefined && (
        <View style={styles.changeRow}>
          <Ionicons
            name={isPositive ? "arrow-up" : "arrow-down"}
            size={14}
            color={isPositive ? colors.sageLight : colors.peach}
          />
          <Text
            style={[
              styles.changeText,
              { color: isPositive ? colors.sageLight : colors.peach },
            ]}
          >
            Bu ay {isPositive ? "+" : ""}%{Math.abs(changePercent)}{" "}
            {isPositive ? "artış" : "azalış"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.terracotta,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    overflow: "hidden", // ← ekle
    position: "relative", // ← ekle (SVG'nin absolute'u buna göre konumlanacak)
  },
  label: {
    fontSize: typography.overline.fontSize,
    fontFamily: typography.overline.fontFamily,
    textTransform: "uppercase",
    letterSpacing: typography.overline.letterSpacing,
    color: colors.peach, // ← textMuted yerine, koyu zeminde daha görünür sıcak bir ton
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: typography.display.fontSize,
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.white, // ← charcoal yerine
    marginBottom: spacing.sm,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  changeText: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
  },
});
