import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDnYE6Qvf4gBg122d_jQyZTmA-V1p45nn4",
  authDomain: "foodexpress-5e4ea.firebaseapp.com",
  projectId: "foodexpress-5e4ea",
  storageBucket: "foodexpress-5e4ea.firebasestorage.app",
  messagingSenderId: "60787851909",
  appId: "1:360787851909:web:685c9b5c099b1fdaaac7ec"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);