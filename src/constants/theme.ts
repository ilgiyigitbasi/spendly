import { Platform } from "react-native";

// Kasam Design Kit — sabit tema (dark/light mod yok)
export const colors = {
  sand: "#FAF5EF", // ana arka plan
  terracotta: "#C4704B", // primary accent
  terracottaPressed: "#A85A3A", // pressed state
  charcoal: "#2D2D2D", // ana metin
  sage: "#8BA888", // pozitif / artış
  peach: "#F4E4D8", // ikincil yüzeyler
  white: "#FFFFFF",
  textMuted: "#8A8580", // caption / subtitle grisi
  border: "#E8E0D8",
  cardAlt: "#EADFD3", // ← ekle
  sageLight: "#B8D4B0", // ← ekle, koyu zeminlerde kontrast için
} as const;

export type ThemeColor = keyof typeof colors;

export const typography = {
  display: { fontSize: 32, fontFamily: "PlusJakartaSans_800ExtraBold" },
  h1: { fontSize: 24, fontFamily: "PlusJakartaSans_700Bold" },
  h2: { fontSize: 20, fontFamily: "PlusJakartaSans_600SemiBold" },
  h3: { fontSize: 18, fontFamily: "PlusJakartaSans_600SemiBold" },
  bodyLarge: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },
  body: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },
  caption: { fontSize: 12, fontFamily: "PlusJakartaSans_500Medium" },
  overline: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_600SemiBold",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  amount: { fontFamily: "PlusJakartaSans_700Bold" }, // tutarlar için - kurala göre Bold/ExtraBold
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999, fab: 28 } as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
