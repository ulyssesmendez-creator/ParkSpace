import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCY69QJ6hOgjYfIpe-bnbwRyQaiSHwQumA",
  authDomain: "parkspace-cbae4.firebaseapp.com",
  projectId: "parkspace-cbae4",
  storageBucket: "parkspace-cbae4.firebasestorage.app",
  messagingSenderId: "1055830156454",
  appId: "1:1055830156454:web:d04c04d2e8f906a7000067"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");


