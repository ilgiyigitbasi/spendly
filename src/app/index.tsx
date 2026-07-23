import { BalanceCard } from "@/components/ui/balance-card";
import { CategoryDonut } from "@/components/ui/category-donut";
import { TransactionItem } from "@/components/ui/transaction-item";
import { BottomTabInset, colors, spacing, typography } from "@/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    icon: "🛒",
    title: "Migros Market",
    subtitle: "Bugün, 12:40 • Mutfak",
    amount: 285.5,
    type: "expense" as const,
  },
  {
    id: "2",
    icon: "💼",
    title: "Maaş",
    subtitle: "1 Tem, 09:00 • Gelir",
    amount: 32000,
    type: "income" as const,
  },
  {
    id: "3",
    icon: "🚗",
    title: "Yakıt",
    subtitle: "Dün, 18:20 • Ulaşım",
    amount: 340,
    type: "expense" as const,
  },
  {
    id: "4",
    icon: "☕",
    title: "Starbucks",
    subtitle: "Dün, 09:15 • Eğlence",
    amount: 120,
    type: "expense" as const,
  },
];

const CATEGORY_DATA = [
  { label: "Market", value: 1980, color: colors.terracotta },
  { label: "Ulaşım", value: 610, color: colors.sage },
  { label: "Eğlence", value: 720, color: colors.peach },
  { label: "Diğer", value: 340, color: colors.textMuted },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Merhaba 👋</Text>

        <BalanceCard balance={48350.2} changePercent={12.4} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategori Dağılımı</Text>
        </View>
        <View style={styles.donutCard}>
          <CategoryDonut data={CATEGORY_DATA} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Harcamalar</Text>
          <Text style={styles.sectionLink}>Tümünü Gör</Text>
        </View>

        {MOCK_TRANSACTIONS.map((tx) => (
          <TransactionItem
            key={tx.id}
            icon={tx.icon}
            title={tx.title}
            subtitle={tx.subtitle}
            amount={tx.amount}
            type={tx.type}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: BottomTabInset + spacing.xxl,
  },
  greeting: {
    fontSize: typography.h1.fontSize,
    fontFamily: typography.h1.fontFamily,
    color: colors.charcoal,
    marginBottom: spacing.sm,
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
  sectionLink: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.terracotta,
  },
  donutCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});
