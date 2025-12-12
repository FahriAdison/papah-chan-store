// pages/submit.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AuthWrapper from '../components/AuthWrapper'; // Import komponen wrapper

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title, price, category, description } = formData;

      if (!title || !price || !category) {
        setError('Mohon isi semua field yang wajib (Judul, Harga, Kategori).');
        return;
      }

      // --- Bagian yang diupdate ---
      // Kita perlu mendapatkan UID user yang sedang login untuk menyimpannya sebagai 'sellerId'
      // Kita bisa mengaksesnya melalui `auth.currentUser.uid`
      // Kita juga bisa mendapatkan email dari `auth.currentUser.email`
      // Pastikan AuthWrapper sudah memastikan user login sebelum sampai ke sini
      const { currentUser } = require('../lib/firebase'); // Import instance auth
      const sellerId = currentUser.uid; // UID user yang sedang login
      const sellerEmail = currentUser.email; // Email user yang sedang login

      const newAccountData = {
        title: title.trim(),
        price: parseFloat(price),
        category: category.trim(),
        description: description.trim(),
        sellerId, // Tambahkan sellerId
        sellerEmail, // Tambahkan sellerEmail (opsional, bisa untuk tampilan)
        createdAt: new Date()
      };
      // --------------------------

      const docRef = await addDoc(collection(db, 'accounts'), newAccountData);

      console.log("Akun berhasil ditambahkan dengan ID: ", docRef.id);
      alert('Akun berhasil ditambahkan!');
      setFormData({
        title: '',
        price: '',
        category: '',
        description: ''
      });
      // Optional: redirect ke halaman utama setelah submit
      router.push('/');

    } catch (error) {
      console.error("Error menambahkan akun: ", error);
      setError(error.message || 'Gagal menambahkan akun. Silakan coba lagi.');
    }
  };

  return (
    // Bungkus isi halaman dengan AuthWrapper
    <AuthWrapper>
      <div>
        <h1>Tambah Akun Baru</h1>
        <a href="/">← Kembali ke Daftar Akun</a>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Judul Akun *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Akun ML Gratis Skin"
            required
          />

          <label htmlFor="price">Harga (Rp) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Contoh: 50000"
            required
          />

          <label htmlFor="category">Kategori *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Contoh: Mobile Legends, Free Fire, Valorant"
            required
          />

          <label htmlFor="description">Deskripsi (Opsional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ceritakan sedikit tentang akun ini..."
          ></textarea>

          <button type="submit">Tambahkan Akun</button>
        </form>
      </div>
    </AuthWrapper>
  );
}
