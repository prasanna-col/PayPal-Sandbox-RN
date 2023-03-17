// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBW3XWmTFkwV6uBmKV1XOpLa-DgsgVr3-0",
    authDomain: "demotest-68868.firebaseapp.com",
    databaseURL: "https://demotest-68868-default-rtdb.firebaseio.com",
    projectId: "demotest-68868",
    storageBucket: "demotest-68868.appspot.com",
    messagingSenderId: "739257118657",
    appId: "1:739257118657:web:305a1e9c929fecd62a0940",
    measurementId: "G-2NH5M6WLFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// export const fb = app.database();
