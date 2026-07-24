import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./context/auth-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await register(name, password);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.logoWrap}>
            <Logo size="large" />
          </View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="İsim"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="default"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            variant="primary"
            title="Kayıt Ol"
            onPress={handleRegister}
            loading={loading}
          />

          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.linkText}>Zaten hesabın var mı? Giriş yap</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.sand },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  logoWrap: { alignItems: "center", marginBottom: spacing.xl },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body.fontSize,
    fontFamily: typography.body.fontFamily,
    color: colors.charcoal,
  },
  error: {
    color: colors.terracotta,
    fontSize: typography.caption.fontSize,
    textAlign: "center",
  },
  linkText: {
    textAlign: "center",
    marginTop: spacing.sm,
    color: colors.terracotta,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: typography.body.fontSize,
  },
});
