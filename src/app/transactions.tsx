import { api } from "@/api/client";
import { Chip } from "@/components/ui/chip";
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
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
  Maaş: "💼",
  "Ek Gelir": "➕",
  Yatırım: "📈",
};

const FILTERS = ["Tümü", "Gelir", "Gider"] as const;

export default function TransactionsScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tümü");
  const [transactions, setTransactions] = useState<any[]>([]);
  const { refreshKey, bump } = useTransactionsRefresh();

  const load = useCallback(async () => {
    try {
      const res = await api.getTransactions();
      setTransactions(res);
    } catch (err) {
      console.log("İşlemler veri hatası:", err);
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

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesFilter =
        filter === "Tümü" ||
        (filter === "Gelir" && tx.type === "income") ||
        (filter === "Gider" && tx.type === "expense");
      const label = tx.note || tx.category;
      const matchesQuery = label.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [transactions, query, filter]);
  const handleDelete = (id: number) => {
    Alert.alert("İşlemi sil", "Bu işlemi silmek istediğine emin misin?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteTransaction(id);
            bump();
          } catch (err: any) {
            Alert.alert("Hata", err.message || "Silinemedi");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>İşlemler</Text>
          <Logo size="small" />
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Harcama veya alıcı ara..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Chip
              key={f}
              label={f}
              selected={filter === f}
              onPress={() => setFilter(f)}
            />
          ))}
        </View>

        {filtered.length === 0 ? (
          <EmptyState
            title="İşlem bulunamadı"
            subtitle="Aramanıza veya filtrelerinize uyan işlem yok"
          />
        ) : (
          filtered.map((tx) => (
            <TransactionItem
              key={tx.id}
              icon={CATEGORY_ICONS[tx.category] || "💳"}
              title={tx.note || tx.category}
              subtitle={`${tx.date} • ${tx.category}`}
              amount={tx.amount}
              type={tx.type}
              onDelete={() => handleDelete(tx.id)}
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
  title: {
    fontSize: typography.h1.fontSize,
    fontFamily: typography.h1.fontFamily,
    color: colors.charcoal,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
    color: colors.charcoal,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: typography.body.fontFamily,
    paddingVertical: spacing.xl,
  },
});
