// pages/submit.js
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SubmitPage() {
  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '', // Misalnya Mobile Legends, Free Fire, dll
    description: '' // Opsional
  });

  // Handler untuk meng-update state saat input berubah
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    try {
      // Ambil data dari form
      const { title, price, category, description } = formData;

      // Validasi sederhana (opsional)
      if (!title || !price || !category) {
        alert('Mohon isi semua field yang wajib (Judul, Harga, Kategori).');
        return;
      }

      // Format data sebelum disimpan
      const newAccountData = {
        title: title.trim(),
        price: parseFloat(price), // Konversi harga ke angka
        category: category.trim(),
        description: description.trim(),
        createdAt: new Date() // Simpan waktu pembuatan
      };

      // Simpan ke Firestore
      // 'accounts' adalah nama koleksi
      const docRef = await addDoc(collection(db, 'accounts'), newAccountData);

      console.log("Akun berhasil ditambahkan dengan ID: ", docRef.id);
      alert('Akun berhasil ditambahkan!');

      // Reset form
      setFormData({
        title: '',
        price: '',
        category: '',
        description: ''
      });

      // Redirect ke halaman utama (opsional)
      // window.location.href = '/';

    } catch (error) {
      console.error("Error menambahkan akun: ", error);
      alert('Gagal menambahkan akun. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <h1>Tambah Akun Baru</h1>
      <a href="/">← Kembali ke Daftar Akun</a>
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
  );
}
