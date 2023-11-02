import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMBb-YRKJDrJNYxj_oqRfFeUpqK970fBs",
  authDomain: "fir-course-90429.firebaseapp.com",
  projectId: "fir-course-90429",
  storageBucket: "fir-course-90429.appspot.com",
  messagingSenderId: "82381501573",
  appId: "1:82381501573:web:307a68bf83332cf096e5ec",
  measurementId: "G-3Z7173N442",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
//base de dados do firebase
export const db = getFirestore(app);
//storage é um local onde é possível realizar upload de arquivos
export const storage = getStorage(app);
