import { api } from "@/api/client";
import { useTransactionsRefresh } from "@/app/context/transactions-context";
import { Button } from "@/components/ui/button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddTransactionSheetProps {
  onClose: () => void;
}

const EXPENSE_CATEGORIES = [
  { label: "Market", icon: "🛒" },
  { label: "Yemek", icon: "🍽️" },
  { label: "Ulaşım", icon: "🚗" },
  { label: "Kira", icon: "🏠" },
  { label: "Eğlence", icon: "🎉" },
  { label: "Sağlık", icon: "💊" },
];

const INCOME_CATEGORIES = [
  { label: "Maaş", icon: "💼" },
  { label: "Ek Gelir", icon: "➕" },
  { label: "Yatırım", icon: "📈" },
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
  const [raw, setRaw] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].label);
  const [saving, setSaving] = useState(false);
  const { bump } = useTransactionsRefresh();

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleKeyPress = (key: string) => {
    if (key === "⌫") {
      setRaw((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "," && raw.includes(",")) return;
    setRaw((prev) => prev + key);
  };

  const handleTypeChange = (t: "expense" | "income") => {
    setType(t);
    setCategory(
      t === "expense"
        ? EXPENSE_CATEGORIES[0].label
        : INCOME_CATEGORIES[0].label,
    );
  };

  const [wholePart, decimalPart] = raw.includes(",")
    ? raw.split(",")
    : [raw, ""];
  const displayWhole = wholePart || "0";
  const displayDecimal = raw.includes(",")
    ? decimalPart.padEnd(2, "0").slice(0, 2)
    : "00";

  const numericAmount = parseFloat(`${wholePart || "0"}.${displayDecimal}`);

  const handleSave = async () => {
    if (numericAmount <= 0) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await api.createTransaction({
        type,
        category,
        amount: numericAmount,
        date: today,
      });
      bump();
      onClose();
    } catch (err: any) {
      Alert.alert("Hata", err.message || "İşlem kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <View style={styles.handle} />

        <Text style={styles.sheetTitle}>
          {type === "expense" ? "Hızlı Gider Girişi" : "Hızlı Gelir Girişi"}
        </Text>

        <View style={styles.typeRow}>
          {(["expense", "income"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => handleTypeChange(t)}
              style={[
                styles.typeChip,
                type === t ? styles.typeChipSelected : styles.typeChipDefault,
              ]}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === t && styles.typeChipTextSelected,
                ]}
              >
                {t === "expense" ? "Gider" : "Gelir"}
              </Text>
            </Pressable>
          ))}
        </View>

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
          {categories.map((cat) => {
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
          loading={saving}
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
  typeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  typeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  typeChipSelected: {
    backgroundColor: colors.terracotta,
    borderColor: colors.terracotta,
  },
  typeChipDefault: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  typeChipText: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
  },
  typeChipTextSelected: {
    color: colors.white,
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
