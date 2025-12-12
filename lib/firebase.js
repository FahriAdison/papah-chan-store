// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// --- Tambahkan baris ini ---
import { getAuth } from 'firebase/auth';
// ---------------------------

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaFWSIjGsYpxSNcdRHGtmZXF2TArZShHo",
  authDomain: "keuangan-vercel.firebaseapp.com",
  projectId: "keuangan-vercel",
  storageBucket: "keuangan-vercel.firebasestorage.app",
  messagingSenderId: "314524581902",
  appId: "1:314524581902:web:67dbcf6f801c32fedb3c5f",
  measurementId: "G-05PDG2HPC3"
};

// Inisialisasi Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inisialisasi Firestore
export const db = getFirestore(app);

// --- Tambahkan baris ini ---
// Inisialisasi Firebase Auth
export const auth = getAuth(app);
// ---------------------------
