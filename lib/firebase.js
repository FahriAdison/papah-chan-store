// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Konfigurasi Firebase
// Konfigurasi ini bisa dilihat oleh siapa saja yang mengakses situs kamu,
// tetapi tidak bisa digunakan untuk mengakses data tanpa izin dari Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyAaFWSIjGsYpxSNcdRHGtmZXF2TArZShHo",
  authDomain: "keuangan-vercel.firebaseapp.com",
  projectId: "keuangan-vercel",
  storageBucket: "keuangan-vercel.firebasestorage.app",
  messagingSenderId: "314524581902",
  appId: "1:314524581902:web:67dbcf6f801c32fedb3c5f",
  measurementId: "G-05PDG2HPC3"
};

// Inisialisasi Firebase
// Kita cek apakah aplikasi Firebase sudah ada untuk mencegah inisialisasi ganda
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Inisialisasi Firestore
export const db = getFirestore(app);

// Jika kamu ingin meng-export app juga
// export { app };
