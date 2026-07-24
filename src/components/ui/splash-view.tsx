import { colors } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LogoMark } from "./logo";

export function SplashView() {
  const progress = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 0.85,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0.15,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <LogoMark size={56} />
      </View>
      <Text style={styles.title}>Spendly</Text>
      <Text style={styles.tagline}>Harcamalarını akıllıca yönet.</Text>

      <View style={styles.bottom}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width }]} />
        </View>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.peach,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontSize: 32, fontWeight: "800", color: colors.charcoal },
  tagline: { fontSize: 15, color: colors.textMuted },
  bottom: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
    gap: 10,
    width: "60%",
  },
  track: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.terracotta, borderRadius: 2 },
  loadingText: { fontSize: 13, color: colors.textMuted },
});
