import AddTransactionSheet from "@/components/ui/add-transaction";
import { SplashView } from "@/components/ui/splash-view";
import { CustomTabBar } from "@/components/ui/tab-bar";
import { colors } from "@/constants/theme";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AddTransactionModalProvider,
  useAddTransactionModal,
} from "./context/add-transaction-modal-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { TransactionsProvider } from "./context/transactions-context";

function RootLayoutContent() {
  const [addVisible, setAddVisible] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [minSplashDone, setMinSplashDone] = useState(false);
  const { visible, close } = useAddTransactionModal();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "login" || segments[0] === "register";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, segments]);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_300Light: require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSans_400Regular: require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    PlusJakartaSans_500Medium: require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSans_600SemiBold: require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    PlusJakartaSans_700Bold: require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSans_800ExtraBold: require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => setMinSplashDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded && minSplashDone) SplashScreen.hideAsync();
  }, [fontsLoaded, minSplashDone]);

  if (!fontsLoaded || !minSplashDone || loading) return <SplashView />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.sand }}>
      <Slot />
      {isAuthenticated && <CustomTabBar />}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.frostLayer} pointerEvents="none" />
          <LinearGradient
            colors={["rgba(244,228,216,0)", "rgba(244,228,216,0.25)"]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <Pressable
            style={styles.sheetWrapper}
            onPress={(e) => e.stopPropagation()}
          >
            <AddTransactionSheet onClose={close} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <TransactionsProvider>
          <AddTransactionModalProvider>
            <RootLayoutContent />
          </AddTransactionModalProvider>
        </TransactionsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(20,15,10,0.55)",
  },
  frostLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(244,228,216,0.08)",
  },
  sheetWrapper: {},
});
