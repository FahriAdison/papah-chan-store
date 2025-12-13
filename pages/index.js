// pages/index.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AuthWrapper from '../components/AuthWrapper';
import Header from '../components/Header'; // Import Header

export default function HomePage({ accounts }) {
  return (
    // Bungkus isi halaman dengan AuthWrapper
    <AuthWrapper>
      {/* Tambahkan Header di sini */}
      <Header />

      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <h1 style={{ color: '#333', marginTop: '20px' }}>Daftar Akun Dijual</h1>
        <a href="/submit" style={{
          display: 'inline-block',
          marginBottom: '20px',
          padding: '10px 15px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          + Tambah Akun Baru
        </a>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {accounts.length > 0 ? (
            accounts.map((acc) => (
              <li key={acc.docId || acc.id} style={{
                backgroundColor: 'white',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '15px' // Jarak antara gambar dan teks
              }}>
                {/* Tampilkan gambar jika ada */}
                {acc.imageUrl && (
                  <img
                    src={acc.imageUrl}
                    alt={acc.title}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                )}
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{acc.title}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Rp {acc.price?.toLocaleString('id-ID')}</strong></p>
                  <p style={{ margin: '5px 0', color: '#6c757d' }}>Kategori: {acc.category}</p>
                  {acc.description && <p style={{ margin: '5px 0' }}>{acc.description}</p>}
                  <small style={{ color: '#888' }}>Dijual oleh: {acc.sellerEmail}</small>
                </div>
              </li>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#6c757d' }}>Belum ada akun yang dijual.</p>
          )}
        </ul>
      </div>
    </AuthWrapper>
  );
}

export async function getServerSideProps() {
  try {
    const querySnapshot = await getDocs(collection(db, 'accounts'));
    const accounts = [];
    querySnapshot.forEach((doc) => {
      accounts.push({ ...doc.data(), docId: doc.id });
    });
    return {
      props: {
        accounts,
      },
    };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return {
      props: {
        accounts: [],
      },
    };
  }
}