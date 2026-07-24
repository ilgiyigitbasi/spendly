import { api } from "@/api/client";
import { Logo } from "@/components/ui/logo";
import { WeeklyBarChart } from "@/components/ui/weekly-bar-chart";
import {
    BottomTabInset,
    colors,
    radius,
    spacing,
    typography,
} from "@/constants/theme";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionsRefresh } from "./context/transactions-context";

const DAY_LABELS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function SummaryScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { refreshKey } = useTransactionsRefresh();

  const load = useCallback(async () => {
    try {
      const res = await api.getTransactions();
      setTransactions(res);
    } catch (err) {
      console.log("Özet veri hatası:", err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    if (refreshKey > 0) load();
  }, [refreshKey]);

  const { weeklyData, weeklyTotal, changePercent, categories, todayIndex } =
    useMemo(() => {
      const today = new Date();
      const days: { date: string; label: string }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push({ date: isoDate(d), label: DAY_LABELS[d.getDay()] });
      }

      const expenseByDate: Record<string, number> = {};
      transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          expenseByDate[t.date] = (expenseByDate[t.date] || 0) + t.amount;
        });

      const weeklyData = days.map((d) => ({
        label: d.label,
        value: expenseByDate[d.date] || 0,
      }));
      const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.value, 0);

      const prevDays: string[] = [];
      for (let i = 13; i >= 7; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        prevDays.push(isoDate(d));
      }
      const prevTotal = prevDays.reduce(
        (sum, date) => sum + (expenseByDate[date] || 0),
        0,
      );
      const changePercent =
        prevTotal > 0
          ? Math.round(((weeklyTotal - prevTotal) / prevTotal) * 100)
          : 0;

      const weekDateSet = new Set(days.map((d) => d.date));
      const categoryTotals: Record<string, number> = {};
      transactions
        .filter((t) => t.type === "expense" && weekDateSet.has(t.date))
        .forEach((t) => {
          categoryTotals[t.category] =
            (categoryTotals[t.category] || 0) + t.amount;
        });

      const sortedCategories = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1],
      );
      const maxAmount = sortedCategories[0]?.[1] || 1;
      const categories = sortedCategories
        .slice(0, 3)
        .map(([label, amount]) => ({
          label,
          amount,
          fraction: amount / maxAmount,
        }));

      return {
        weeklyData,
        weeklyTotal,
        changePercent,
        categories,
        todayIndex: 6,
      };
    }, [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Özet & Analiz</Text>
          <Logo size="small" />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.overline}>HAFTALIK HARCAMA</Text>
              <Text style={styles.bigAmount}>
                ₺{weeklyTotal.toLocaleString("tr-TR")},00
              </Text>
            </View>
            {changePercent !== 0 && (
              <View style={styles.changeBadge}>
                <Text style={styles.changeText}>
                  {changePercent < 0 ? "↓" : "↑"} {Math.abs(changePercent)}%
                </Text>
              </View>
            )}
          </View>
          <WeeklyBarChart data={weeklyData} activeIndex={todayIndex} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
          {categories.length === 0 ? (
            <Text style={styles.emptyText}>Bu hafta için henüz gider yok.</Text>
          ) : (
            <View style={{ gap: spacing.md }}>
              {categories.map((cat) => (
                <View key={cat.label} style={{ gap: 6 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                    <Text style={styles.categoryAmount}>
                      ₺{cat.amount.toLocaleString("tr-TR")}
                    </Text>
                  </View>
                  <View style={styles.track}>
                    <View
                      style={[styles.fill, { width: `${cat.fraction * 100}%` }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.sand },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: BottomTabInset + spacing.xxl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontFamily: typography.h1.fontFamily,
    color: colors.charcoal,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  overline: {
    fontSize: typography.overline.fontSize,
    fontFamily: typography.overline.fontFamily,
    letterSpacing: typography.overline.letterSpacing,
    color: colors.textMuted,
    marginBottom: 4,
  },
  bigAmount: {
    fontSize: typography.h1.fontSize,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    color: colors.charcoal,
  },
  changeBadge: {
    backgroundColor: "rgba(139,168,136,0.15)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  changeText: {
    fontSize: typography.caption.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.sage,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontFamily: typography.h3.fontFamily,
    color: colors.charcoal,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
  },
  categoryAmount: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.charcoal,
  },
  track: {
    height: 8,
    backgroundColor: colors.sand,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.terracotta, borderRadius: 4 },
  emptyText: {
    color: colors.textMuted,
    fontFamily: typography.body.fontFamily,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
});
