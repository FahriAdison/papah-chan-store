// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// --- Tambahkan baris ini ---
import { getStorage } from 'firebase/storage';
// ---------------------------

const firebaseConfig = {
  apiKey: "AIzaSyAaFWSIjGsYpxSNcdRHGtmZXF2TArZShHo",
  authDomain: "keuangan-vercel.firebaseapp.com",
  projectId: "keuangan-vercel",
  storageBucket: "keuangan-vercel.firebasestorage.app",
  messagingSenderId: "314524581902",
  appId: "1:314524581902:web:67dbcf6f801c32fedb3c5f",
  measurementId: "G-05PDG2HPC3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
// --- Tambahkan baris ini ---
export const storage = getStorage(app);
// ---------------------------