import { colors, radius, spacing } from "@/constants/theme";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost" | "fab";

interface ButtonProps extends Omit<PressableProps, "style"> {
  variant?: ButtonVariant;
  title?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  variant = "primary",
  title,
  loading,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "primary" && pressed && styles.primaryPressed,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "fab" && styles.fab,
        (disabled || loading) && styles.disabled,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.white : colors.terracotta}
        />
      ) : variant === "fab" ? (
        <Text style={styles.fabIcon}>+</Text>
      ) : (
        <Text
          style={[
            styles.text,
            variant === "primary" && styles.textOnPrimary,
            (variant === "secondary" || variant === "ghost") &&
              styles.textOnLight,
            variant === "ghost" && styles.ghostText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.terracotta,
    alignSelf: "stretch",
  },
  primaryPressed: {
    backgroundColor: colors.terracottaPressed,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.terracotta,
    alignSelf: "stretch",
  },
  ghost: {
    backgroundColor: "transparent",
    paddingVertical: spacing.sm,
  },
  fab: {
    width: radius.fab * 2,
    height: radius.fab * 2,
    borderRadius: radius.fab,
    backgroundColor: colors.terracotta,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  textOnPrimary: {
    color: colors.white,
  },
  textOnLight: {
    color: colors.terracotta,
  },
  ghostText: {
    textDecorationLine: "underline",
  },
  fabIcon: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 24,
  },
});
