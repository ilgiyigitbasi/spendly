import { useAddTransactionModal } from "@/app/context/add-transaction-modal-context";
import { BottomTabInset, colors, radius, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TABS = [
  { name: "index", label: "Ana Sayfa", icon: "home" as const },
  { name: "transactions", label: "İşlemler", icon: "swap-horizontal" as const },
  { name: "summary", label: "Özet", icon: "pie-chart" as const },
];

export function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useAddTransactionModal();

  return (
    <View style={[styles.wrapper, { paddingBottom: BottomTabInset / 3 }]}>
      <View style={styles.bar}>
        {TABS.map((tab, i) => {
          const isActive =
            pathname === (tab.name === "index" ? "/" : `/${tab.name}`);
          return (
            <Pressable
              key={tab.name}
              style={styles.tabItem}
              onPress={() =>
                router.push(
                  tab.name === "index" ? "/" : (("/" + tab.name) as any),
                )
              }
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? colors.terracotta : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && { color: colors.terracotta },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.dot} />}
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.fab} onPress={open}>
        <Ionicons name="add" size={26} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    width: "88%",
  },
  tabItem: { alignItems: "center", gap: 2, paddingHorizontal: 6 },
  tabLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.caption.fontFamily,
    color: colors.textMuted,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.terracotta,
    marginTop: 1,
  },
  fab: {
    position: "absolute",
    right: 28,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.terracotta,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
});
