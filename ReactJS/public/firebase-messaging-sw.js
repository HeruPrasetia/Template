importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "",
    authDomain: "web-notif-9eba0.firebaseapp.com",
    databaseURL: "https://web-notif-9eba0.firebaseio.com",
    projectId: "web-notif-9eba0",
    storageBucket: "web-notif-9eba0.firebasestorage.app",
    messagingSenderId: "271316405524",
    appId: "1:271316405524:web:56a77a86bdb20f8e7e0601",
    measurementId: "G-2C7NNCL3TD"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
