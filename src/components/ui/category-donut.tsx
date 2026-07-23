import { colors, spacing, typography } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface CategorySlice {
  label: string;
  value: number;
  color: string;
}

interface CategoryDonutProps {
  data: CategorySlice[];
  size?: number;
}

export function CategoryDonut({ data, size = 140 }: CategoryDonutProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = data.map((slice) => ({
    value: slice.value,
    color: slice.color,
  }));

  return (
    <View style={styles.wrapper}>
      <PieChart
        data={chartData}
        donut
        radius={size / 2}
        innerRadius={size / 2 - 18}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={styles.centerAmount}>
              ₺{total.toLocaleString("tr-TR")}
            </Text>
            <Text style={styles.centerCaption}>toplam gider</Text>
          </View>
        )}
      />

      <View style={styles.legend}>
        {data.map((slice, i) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <View key={i} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: slice.color }]} />
              <Text style={styles.legendLabel}>{slice.label}</Text>
              <Text style={styles.legendPct}>%{pct}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  centerLabel: { alignItems: "center", justifyContent: "center" },
  centerAmount: {
    fontSize: typography.h3.fontSize,
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.charcoal,
  },
  centerCaption: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.textMuted,
  },
  legend: {
    flex: 1,
    gap: spacing.sm,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: {
    flex: 1,
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
    color: colors.charcoal,
  },
  legendPct: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.textMuted,
  },
});
