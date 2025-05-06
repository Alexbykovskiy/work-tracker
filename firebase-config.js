// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiPP4AYEfu7E14Kk_CVxqioaf5QX5rz70",
  authDomain: "work-tracker-50eab.firebaseapp.com",
  projectId: "work-tracker-50eab",
  storageBucket: "work-tracker-50eab.firebasestorage.app",
  messagingSenderId: "397564235584",
  appId: "1:397564235584:web:cb19ad8d41eb3c7a8ff4a5",
  measurementId: "G-21W3EGG9JB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);