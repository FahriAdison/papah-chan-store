// pages/api/upload.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // Diperlukan untuk menghandle multipart/form-data
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, contentType, blobBuffer } = req.body; // Dalam praktiknya, kita baca dari stream
  // Kita gunakan multer-like untuk membaca file, tapi Next.js API Routes punya cara sendiri
  // Kita baca file dari req.body secara langsung (ini bisa kompleks, jadi kita coba pendekatan umum)

  // --- Cara yang lebih umum di Next.js API Routes ---
  // Kita butuh middleware untuk parsing multipart/form-data, atau gunakan library
  // Tapi Next.js 13+ App Router lebih mendukung FormData langsung
  // Untuk Pages Router, kita bisa gunakan library seperti busboy atau multiparty
  // Karena kompleksitas, kita ikuti dokumentasi Vercel yang menyarankan penggunaan `busboy` atau `multiparty`

  // Install multiparty: npm install multiparty
  const multiparty = require('multiparty');

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Parse error:", err);
      return res.status(500).json({ error: 'Failed to parse form data' });
    }

    const file = files.file[0]; // Sesuaikan dengan name field di form kamu

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = require('fs').readFileSync(file.path);

    try {
      // Upload ke Vercel Blob
      const blob = await put(file.originalFilename, buffer, {
        contentType: file.headers['content-type'],
        access: 'public', // Agar bisa diakses publik
      });

      // Kembalikan URL blob
      return res.status(200).json({ url: blob.url });
    } catch (uploadError) {
      console.error("Blob upload error:", uploadError);
      return res.status(500).json({ error: 'Failed to upload to blob' });
    }
  });
}