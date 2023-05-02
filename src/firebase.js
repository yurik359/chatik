// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you wampnt to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnfehnaKbM-abzyU17D1Fe2Q5_tMkAtME",
  authDomain: "chatik-7ec8c.firebaseapp.com",
  projectId: "chatik-7ec8c",
  storageBucket: "chatik-7ec8c.appspot.com",
  messagingSenderId: "294755652052",
  appId: "1:294755652052:web:efffecafe35fa65b774641"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =getAuth();
export const db = getFirestore()