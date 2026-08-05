importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDnYE6Qvf4gBg122d_jQyZTmA-V1p45nn4",
  authDomain: "foodexpress-5e4ea.firebaseapp.com",
  projectId: "foodexpress-5e4ea",
  storageBucket: "foodexpress-5e4ea.firebasestorage.app",
  messagingSenderId: "60787851909",
  appId: "1:360787851909:web:685c9b5c099b1fdaaac7ec",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo192.png",
    }
  );
});