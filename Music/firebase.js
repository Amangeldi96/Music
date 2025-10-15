import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOygqrGyyE6sLfaVmq59X-KR7J9PGqU-w",
  authDomain: "coffee-spark-ai-barista-55105.firebaseapp.com",
  projectId: "coffee-spark-ai-barista-55105",
  storageBucket: "coffee-spark-ai-barista-55105.firebasestorage.app",
  messagingSenderId: "272304240891",
  appId: "1:272304240891:web:e2a59058f421b00de5585e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ вот эта строка нужна для авторизации
