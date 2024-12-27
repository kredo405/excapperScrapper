import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Для Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBaCi843YIFKmo5MJDXHlk2tDm54xNVqsQ",
  authDomain: "kredo-bet.firebaseapp.com",
  projectId: "kredo-bet",
  storageBucket: "kredo-bet.appspot.com",
  messagingSenderId: "34405464606",
  appId: "1:34405464606:web:bb41227f9d4f4c03eb8c0f",
  measurementId: "G-M30NKH2EMH",
};
// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспортируйте Firestore и Realtime Database
export const firestore = getFirestore(app);
