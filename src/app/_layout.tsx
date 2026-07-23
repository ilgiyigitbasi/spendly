import AddTransactionSheet from "@/components/ui/add-transaction";
import { CustomTabBar } from "@/components/ui/tab-bar";
import { colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [addVisible, setAddVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_300Light: require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    PlusJakartaSans_400Regular: require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    PlusJakartaSans_500Medium: require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSans_600SemiBold: require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    PlusJakartaSans_700Bold: require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSans_800ExtraBold: require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.sand }}>
      <Slot />
      <CustomTabBar onAddPress={() => setAddVisible(true)} />

      <Modal
        visible={addVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setAddVisible(false)}>
          <BlurView intensity={25} tint="dark" style={styles.backdrop}>
            <Pressable
              style={styles.sheetWrapper}
              onPress={(e) => e.stopPropagation()}
            >
              <AddTransactionSheet onClose={() => setAddVisible(false)} />
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    // AddTransactionSheet kendi padding/radius'unu taşıyor, burada ekstra bir şeye gerek yok
  },
});
