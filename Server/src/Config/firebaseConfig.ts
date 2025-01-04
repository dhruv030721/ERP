import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_BUCKET_URL,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Export the storage instance
export const storage = getStorage(firebaseApp);
