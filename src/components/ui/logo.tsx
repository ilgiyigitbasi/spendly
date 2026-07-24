import { colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

interface LogoMarkProps {
  size?: number;
  tone?: "default" | "onDark";
}

export function LogoMark({ size = 24, tone = "default" }: LogoMarkProps) {
  const barColor = tone === "onDark" ? colors.white : colors.terracotta;
  const ringFill =
    tone === "onDark" ? colors.terracottaPressed : colors.terracotta;
  const ringDot = tone === "onDark" ? colors.white : colors.sand;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="10.7998"
        y="2.4"
        width="9.6"
        height="3.84"
        rx="1.92"
        fill={barColor}
        fillOpacity={0.55}
      />
      <Rect
        x="3.6001"
        y="8.16"
        width="16.8"
        height="3.84"
        rx="1.92"
        fill={barColor}
      />
      <Rect
        x="3.6001"
        y="13.92"
        width="12"
        height="3.84"
        rx="1.92"
        fill={barColor}
        fillOpacity={0.75}
      />
      <Circle cx="19.6798" cy="18.72" r="2.88" fill={ringFill} />
      <Circle cx="19.68" cy="18.72" r="1.2" fill={ringDot} />
    </Svg>
  );
}

interface LogoProps {
  size?: "large" | "medium" | "small";
}

const ICON_SIZE = { large: 56, medium: 32, small: 22 };
const TEXT_SIZE = { large: 40, medium: 22, small: 16 };

export function Logo({ size = "medium" }: LogoProps) {
  return (
    <View style={styles.row}>
      <LogoMark size={ICON_SIZE[size]} />
      <Text style={[styles.text, { fontSize: TEXT_SIZE[size] }]}>Spendly</Text>
    </View>
  );
}

export function LogoToken({ size = 96 }: { size?: number }) {
  return (
    <View
      style={[
        styles.token,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <LogoMark size={size * 0.5} tone="onDark" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  text: { fontFamily: "PlusJakartaSans_800ExtraBold", color: colors.charcoal },
  token: {
    backgroundColor: colors.terracotta,
    alignItems: "center",
    justifyContent: "center",
  },
});
