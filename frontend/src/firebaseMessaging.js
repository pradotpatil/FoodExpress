import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BCWxYLsA5tpcVNfgtQFExvoHrRr3CohXsSoUnoa-rqChc-rTd6qoUhDKj-IVXeu4L8Tjyg9d78KKiqB8QmiIO0U"
    });

    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.error("Notification error:", error);
    return null;
  }
}