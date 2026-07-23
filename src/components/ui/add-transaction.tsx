import { Button } from "@/components/ui/button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface AddTransactionSheetProps {
  onClose: () => void;
}
const CATEGORIES = [
  { label: "Market", icon: "🛒" },
  { label: "Yemek", icon: "🍽️" },
  { label: "Ulaşım", icon: "🚗" },
  { label: "Kira", icon: "🏠" },
  { label: "Eğlence", icon: "🎉" },
  { label: "Sağlık", icon: "💊" },
];

const NUMPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [",", "0", "⌫"],
];

export default function AddTransactionScreen({
  onClose,
}: AddTransactionSheetProps) {
  const [raw, setRaw] = useState(""); // örn. "450,00" ekrana çıkmadan önce ham girdi
  const [category, setCategory] = useState("Market");

  const handleKeyPress = (key: string) => {
    if (key === "⌫") {
      setRaw((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "," && raw.includes(",")) return; // ikinci virgülü engelle
    setRaw((prev) => prev + key);
  };

  const [wholePart, decimalPart] = raw.includes(",")
    ? raw.split(",")
    : [raw, ""];
  const displayWhole = wholePart || "0";
  const displayDecimal = raw.includes(",")
    ? decimalPart.padEnd(2, "0").slice(0, 2)
    : "00";

  const numericAmount = parseFloat(`${wholePart || "0"}.${displayDecimal}`);

  const handleSave = () => {
    // TODO: backend'e POST /transactions { amount: numericAmount, category, type: "expense" }
    onClose();
  };

  return (
    <View>
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <View style={styles.handle} />

        <Text style={styles.sheetTitle}>Hızlı Gider Girişi</Text>

        <View style={styles.amountRow}>
          <Text style={styles.amountWhole}>₺{displayWhole}</Text>
          <Text style={styles.amountDecimal}>,{displayDecimal}</Text>
        </View>

        <Text style={styles.label}>KATEGORİ SEÇİN</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => {
            const selected = category === cat.label;
            return (
              <Pressable
                key={cat.label}
                onPress={() => setCategory(cat.label)}
                style={[
                  styles.categoryChip,
                  selected
                    ? styles.categoryChipSelected
                    : styles.categoryChipDefault,
                ]}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    selected && styles.categoryLabelSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.numpad}>
          {NUMPAD_ROWS.map((row, i) => (
            <View key={i} style={styles.numpadRow}>
              {row.map((key) => (
                <Pressable
                  key={key}
                  onPress={() => handleKeyPress(key)}
                  style={styles.numpadKey}
                >
                  <Text style={styles.numpadKeyText}>{key}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <Button
          variant="primary"
          title={`Kaydet (₺${displayWhole},${displayDecimal})`}
          onPress={handleSave}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(45,45,45,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    textAlign: "center",
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.terracotta,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: spacing.sm,
  },
  amountWhole: {
    fontSize: 48,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    color: colors.charcoal,
  },
  amountDecimal: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.textMuted,
  },
  label: {
    fontSize: typography.overline.fontSize,
    fontFamily: typography.overline.fontFamily,
    letterSpacing: typography.overline.letterSpacing,
    color: colors.textMuted,
  },
  categoryRow: {
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  categoryChipSelected: {
    backgroundColor: colors.terracotta,
    borderColor: colors.terracotta,
  },
  categoryChipDefault: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  categoryIcon: { fontSize: 14 },
  categoryLabel: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
  },
  categoryLabelSelected: {
    color: colors.white,
  },
  numpad: {
    gap: spacing.sm,
  },
  numpadRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  numpadKey: {
    flex: 1,
    backgroundColor: colors.sand,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  numpadKeyText: {
    fontSize: typography.h2.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
  },
});
