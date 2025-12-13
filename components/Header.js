// components/Header.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Monitor status login
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Fungsi Firebase untuk logout
      router.push('/login'); // Arahkan ke halaman login setelah logout
    } catch (error) {
      console.error("Logout error:", error);
      alert('Gagal logout. Silakan coba lagi.');
    }
  };

  // Jika tidak ada user yang login, jangan tampilkan header
  if (!currentUser) {
    return null;
  }

  return (
    <header style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        {/* Logo atau judul sederhana */}
        <h3 style={{ margin: 0 }}>Papah-Chan Store</h3>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Tampilkan email user */}
        <span style={{ marginRight: '15px' }}>
          Halo, {currentUser.email}
        </span>
        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}