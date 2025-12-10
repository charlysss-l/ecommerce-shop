import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqysOx4vZxLxxG0mEjkRKQ4Vj78yHUTY8",
  authDomain: "my-shop-a4179.firebaseapp.com",
  projectId: "my-shop-a4179",
  storageBucket: "my-shop-a4179.firebasestorage.app",
  messagingSenderId: "830651097244",
  appId: "1:830651097244:web:4fa347d6d4f2b207a3cd59",
  measurementId: "G-X0SMLGVFT8"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
