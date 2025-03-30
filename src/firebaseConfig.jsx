import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCnay_U8JXu4KqQKIVCPVMnLFF1SAn31fQ",
    authDomain: "stal-b1faa.firebaseapp.com",
    projectId: "stal-b1faa",
    storageBucket: "stal-b1faa.firebasestorage.app",
    messagingSenderId: "138725395926",
    appId: "1:138725395926:web:4547791578080370dfe877",
    measurementId: "G-TFZM26ZGSD"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };