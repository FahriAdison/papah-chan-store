// components/AuthWrapper.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Komponen wrapper untuk halaman yang membutuhkan login
export default function AuthWrapper({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged mendengarkan perubahan status login user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User sedang login
        setCurrentUser(user);
      } else {
        // User tidak login
        setCurrentUser(null);
        // Redirect ke login page, kecuali sedang di halaman login
        if (router.pathname !== '/login') {
          router.replace('/login'); // replace agar tidak bisa kembali ke halaman ini dengan back button
        }
      }
      setLoading(false); // Matikan loading setelah status diketahui
    });

    // Cleanup listener saat komponen dilepas
    return () => unsubscribe();
  }, [router]);

  // Tampilkan loading indicator sementara status login dicek
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Mohon Tunggu...</p>
      </div>
    );
  }

  // Jika user login, render children (komponen halaman yang diproteksi)
  // Jika user tidak login, komponen ini tidak akan merender children karena sudah redirect di useEffect
  return currentUser ? children : null;
}
