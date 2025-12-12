// pages/register-user.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function RegisterUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email dan Password harus diisi.');
      return;
    }

    try {
      // 1. Buat akun user di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Simpan data profil user (role: 'sales') ke Firestore
      // Kita gunakan UID user sebagai ID dokumen di Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        email: email,
        role: 'sales', // Tetapkan role sebagai 'sales'
        createdAt: new Date()
      });

      console.log("User berhasil didaftarkan: ", newUser.email);
      alert(`User ${email} berhasil ditambahkan sebagai Sales!`);

      // Reset form
      setEmail('');
      setPassword('');
      setError('');

      // Optional: Redirect ke halaman manage users
      // router.push('/manage-users');

    } catch (err) {
      console.error("Register error:", err);
      // Tampilkan pesan error dari Firebase (contoh: password terlalu lemah)
      setError(err.message || 'Gagal menambahkan user. Silakan coba lagi.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Tambah User Sales (Owner Only)</h2>
        <a href="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#007bff', textDecoration: 'none' }}>← Kembali ke Halaman Utama</a>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Sales Baru:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@sales.com"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password kuat"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <button
            type="submit"
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Tambahkan User Sales
          </button>
        </form>
      </div>
    </div>
  );
}
