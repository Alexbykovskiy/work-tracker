// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCiPPAAYEfu7E14kK_CVxqioaf5QX5rz70",
  authDomain: "work-tracker-50eab.firebaseapp.com",
  projectId: "work-tracker-50eab",
  storageBucket: "work-tracker-50eab.appspot.com",
  messagingSenderId: "397564235584",
  appId: "1:397564235584:web:cb19ad8d41eb3c7a8ff4a5",
  measurementId: "G-21W3EGG9JB"
};

// Инициализация Firebase (для версии с Firebase 8)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
