// pages/index.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Import instance Firestore dari file konfigurasi

export default function HomePage({ accounts }) {
  // Render daftar akun
  return (
    <div>
      <h1>Daftar Akun Dijual</h1>
      <a href="/submit">+ Tambah Akun Baru</a>
      <ul>
        {accounts.length > 0 ? (
          accounts.map((acc) => (
            <li key={acc.id || acc.docId}> {/* Gunakan docId jika id tidak disimpan */ }
              <strong>{acc.title}</strong> - Rp {acc.price} ({acc.category})
              {/* Tambahkan link ke detail akun jika sudah ada */}
            </li>
          ))
        ) : (
          <p>Belum ada akun yang dijual.</p>
        )}
      </ul>
    </div>
  );
}

// Fungsi ini berjalan di server (Next.js) untuk mengambil data sebelum merender halaman
export async function getServerSideProps() {
  try {
    // Ambil koleksi 'accounts' dari Firestore
    const querySnapshot = await getDocs(collection(db, 'accounts'));
    const accounts = [];

    // Loop melalui hasil query dan simpan ke array
    querySnapshot.forEach((doc) => {
      // doc.data() adalah objek yang berisi data dari dokumen
      // doc.id adalah ID unik dari dokumen itu sendiri
      accounts.push({ ...doc.data(), docId: doc.id }); // Menyertakan ID dokumen
    });

    // Kirim data ke props komponen
    return {
      props: {
        accounts, // Data yang dikirim ke komponen HomePage
      },
    };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    // Jika terjadi error, kirim array kosong
    return {
      props: {
        accounts: [],
      },
    };
  }
}
