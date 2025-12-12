// pages/submit.js (sudah ada AuthWrapper, jadi kita cuma ubah isi return-nya)
import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; // Import auth
import AuthWrapper from '../components/AuthWrapper';

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

      // Dapatkan UID dan Email user yang login
      const currentUser = auth.currentUser; // AuthWrapper memastikan ini tidak null
      if (!currentUser) {
        throw new Error("User tidak ditemukan. Silakan login kembali.");
      }

      const newAccountData = {
        title: title.trim(),
        price: parseFloat(price),
        category: category.trim(),
        description: description.trim(),
        sellerId: currentUser.uid, // Pastikan sellerId diset
        sellerEmail: currentUser.email, // Pastikan sellerEmail diset
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'accounts'), newAccountData);

      console.log("Akun berhasil ditambahkan dengan ID: ", docRef.id);
      alert('Akun berhasil ditambahkan!');
      setFormData({
        title: '',
        price: '',
        category: '',
        description: ''
      });
      router.push('/');

    } catch (error) {
      console.error("Error menambahkan akun: ", error);
      setError(error.message || 'Gagal menambahkan akun. Silakan coba lagi.');
    }
  };

  return (
    <AuthWrapper>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Tambah Akun Baru</h2>
          <a href="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#007bff', textDecoration: 'none' }}>← Kembali ke Daftar Akun</a>
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>Judul Akun *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Akun ML Gratis Skin"
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem' }}>Harga (Rp) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Contoh: 50000"
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>Kategori *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Contoh: Mobile Legends, Free Fire, Valorant"
                required
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>Deskripsi (Opsional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ceritakan sedikit tentang akun ini..."
                rows="3"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              ></textarea>
            </div>
            <button
              type="submit"
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Tambahkan Akun
            </button>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}
