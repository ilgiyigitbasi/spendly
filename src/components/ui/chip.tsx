import { colors, radius, spacing, typography } from "@/constants/theme";
import { Pressable, StyleSheet, Text } from "react-native";

interface ChipProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, icon, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.terracotta,
    borderColor: colors.terracotta,
  },
  unselected: { backgroundColor: colors.white, borderColor: colors.border },
  icon: { fontSize: 14 },
  label: {
    fontSize: typography.body.fontSize,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.charcoal,
  },
  labelSelected: { color: colors.white },
});
