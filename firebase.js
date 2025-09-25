// Importa Firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyByAv12zVq6SWMK67UpnBLWzbZ86RSkJn8",
  authDomain: "escala-ce264.firebaseapp.com",
  projectId: "escala-ce264",
  storageBucket: "escala-ce264.appspot.com",
  messagingSenderId: "677422197791",
  appId: "1:677422197791:web:eda8829351766b7890f92a",
  measurementId: "G-6YCNGT1771"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
