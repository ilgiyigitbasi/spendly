import { api } from "@/api/client";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  try {
    if (!Device.isDevice) {
      console.log("Push bildirimi gerçek cihazda test edilmeli.");
      return null;
    }

    // Android 13 için permission istemeden önce oluştur.
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Spendly Bildirimleri",
        description: "Harcama hatırlatmaları ve Spendly bildirimleri",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#C4704B",
        sound: "default",
      });
    }

    const permission = await Notifications.getPermissionsAsync();

    console.log("Mevcut notification izni:", permission.status);

    let finalStatus = permission.status;

    if (finalStatus !== "granted") {
      const requestedPermission = await Notifications.requestPermissionsAsync();

      finalStatus = requestedPermission.status;
    }

    console.log("Son notification izni:", finalStatus);

    if (finalStatus !== "granted") {
      console.log("Bildirim izni verilmedi.");
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    console.log("EAS project ID:", projectId);

    if (!projectId) {
      throw new Error("EAS project ID bulunamadı.");
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const expoPushToken = tokenData.data;

    console.log("Expo push token alındı:", expoPushToken);

    const registerResult = await api.registerPushToken(expoPushToken);

    console.log("Push token backend'e kaydedildi:", registerResult);

    return expoPushToken;
  } catch (error) {
    console.log("Push notification kayıt hatası:", error);
    return null;
  }
}

export async function sendLocalNotificationTest() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Spendly yerel test",
      body: "Telefonun notification gösterimi çalışıyor.",
      sound: "default",
    },
    trigger: null,
  });
}
