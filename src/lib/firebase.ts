import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC1k61SNK4zxiHBwSE2ER-pU3cjeSMuVFc",
  authDomain: "ah---project.firebaseapp.com",
  projectId: "ah---project",
  storageBucket: "ah---project.firebasestorage.app",
  messagingSenderId: "429688064674",
  appId: "1:429688064674:web:5b85569eaeb4804436a5fb",
  measurementId: "G-VKD9C8CT09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
