import { api } from "@/api/client";
import { BalanceCard } from "@/components/ui/balance-card";
import { CategoryDonut } from "@/components/ui/category-donut";
import { EmptyState } from "@/components/ui/empty-state";
import { Logo } from "@/components/ui/logo";
import { TransactionItem } from "@/components/ui/transaction-item";
import {
  BottomTabInset,
  colors,
  radius,
  spacing,
  typography,
} from "@/constants/theme";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTransactionsRefresh } from "./context/transactions-context";

const CATEGORY_ICONS: Record<string, string> = {
  Market: "🛒",
  Yemek: "🍽️",
  Ulaşım: "🚗",
  Kira: "🏠",
  Eğlence: "🎉",
  Sağlık: "💊",
  Diğer: "📦",
};

export default function HomeScreen() {
  const [balance, setBalance] = useState<{
    balance: number;
    income: number;
    expense: number;
  } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshKey } = useTransactionsRefresh();

  const load = useCallback(async () => {
    try {
      const [balanceRes, txRes] = await Promise.all([
        api.getBalance(),
        api.getTransactions(),
      ]);
      setBalance(balanceRes);
      setTransactions(txRes);
    } catch (err) {
      console.log("Ana sayfa veri hatası:", err);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const CHART_PALETTE = [
    colors.terracotta,
    colors.sage,
    colors.peach,
    colors.textMuted,
    "#7C93D9", // soft mavi
    "#C97FD4", // mor
    "#E0A85F", // amber
    "#5FA88A", // koyu yeşil
  ];

  function colorForIndex(i: number) {
    if (i < CHART_PALETTE.length) return CHART_PALETTE[i];
    // palet taşarsa altın açı (golden angle) ile otomatik, birbirinden uzak tonlar üret
    const hue = (i * 137.5) % 360;
    return `hsl(${hue}, 55%, 55%)`;
  }

  const categoryData = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {}),
  ).map(([label, value], i) => ({
    label,
    value: value as number,
    color: colorForIndex(i),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Merhaba 👋</Text>
          <Logo size="small" />
        </View>

        <BalanceCard
          balance={balance?.balance ?? 0}
          changePercent={undefined}
        />

        {categoryData.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
            </View>
            <View style={styles.donutCard}>
              <CategoryDonut data={categoryData} />
            </View>
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Harcamalar</Text>
        </View>

        {transactions.length === 0 ? (
          <EmptyState
            title="Henüz işlem yok"
            subtitle="Başlamak için bakiye kartına dokun"
          />
        ) : (
          transactions
            .slice(0, 10)
            .map((tx) => (
              <TransactionItem
                key={tx.id}
                icon={CATEGORY_ICONS[tx.category] || "💳"}
                title={tx.note || tx.category}
                subtitle={`${tx.date} • ${tx.category}`}
                amount={tx.amount}
                type={tx.type}
              />
            ))
        )}
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
  greeting: {
    fontSize: typography.h1.fontSize,
    fontFamily: typography.h1.fontFamily,
    color: colors.charcoal,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontFamily: typography.h3.fontFamily,
    color: colors.charcoal,
  },
  donutCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: typography.body.fontFamily,
    paddingVertical: spacing.xl,
  },
});
