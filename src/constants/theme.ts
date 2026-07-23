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
} as const;

export type ThemeColor = keyof typeof colors;

export const typography = {
  display: { fontSize: 32, fontWeight: "700" as const },
  h1: { fontSize: 24, fontWeight: "700" as const },
  h2: { fontSize: 20, fontWeight: "600" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  bodyLarge: { fontSize: 16, fontWeight: "500" as const },
  body: { fontSize: 14, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
  overline: {
    fontSize: 11,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
};

export const spacing = {
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
