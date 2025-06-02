import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCc_QjwUUlesT37k-LcupwCSCMAYXTSpzU",
    authDomain: "chatappproject-93935.firebaseapp.com",
    projectId: "chatappproject-93935",
    storageBucket: "chatappproject-93935.firebasestorage.app",
    messagingSenderId: "891494817113",
    appId: "1:891494817113:web:0a229af86f7877a5c74048",
    measurementId: "G-TW5FMTL5FP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
