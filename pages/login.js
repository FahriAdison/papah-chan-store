// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login berhasil → arahkan ke halaman utama
      router.push('/');
    } catch (err) {
      console.error("Login error:", err);

      // Ubah error Firebase jadi pesan yang mudah dipahami
      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Email tidak ditemukan.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Password salah.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau password salah.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Terlalu banyak percobaan gagal. Coba lagi nanti.';
      }

      setError(errorMessage);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
          Login ke Papah-Chan Store
        </h2>
        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@anda.com"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>
          <button
            type="submit"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
