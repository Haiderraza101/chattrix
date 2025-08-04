import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3HqkXj9raniePLm2UVKswHA-zgli7bFI",
  authDomain: "chattrix-75022.firebaseapp.com",
  projectId: "chattrix-75022",
  storageBucket: "chattrix-75022.appspot.com",
  messagingSenderId: "616703637133",
  appId: "1:616703637133:web:fe837ee8b2c1284f3a94c4",
  measurementId: "G-EQGBZE3G38"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
