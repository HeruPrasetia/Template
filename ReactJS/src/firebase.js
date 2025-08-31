import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
    apiKey: "AIzaSyBpmT10e7yYBT1a5zr_aiInuZTg72b_AgU",
    authDomain: "web-notif-9eba0.firebaseapp.com",
    databaseURL: "https://web-notif-9eba0.firebaseio.com",
    projectId: "web-notif-9eba0",
    storageBucket: "web-notif-9eba0.firebasestorage.app",
    messagingSenderId: "271316405524",
    appId: "1:271316405524:web:56a77a86bdb20f8e7e0601",
    measurementId: "G-2C7NNCL3TD"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const requestForToken = async (setTokenFound, token) => {
    return getToken(messaging, { vapidKey: 'BEaBeckIPEClXBsuLCYZ-dlXF2bvfcwRkb9uqARucbYuzjmn6A9bi0CVGDaJzi3iVuJRMJv8z9WIH5wnxJgrsrs' })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                setTokenFound(true, currentToken);
            } else {
                console.log('No registration token available. Request permission to generate one.');
                setTokenFound(false);
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            setTokenFound(false);
        });
};

const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export {
    auth,
    provider,
    signInWithPopup,
    requestForToken,
    onMessageListener
};