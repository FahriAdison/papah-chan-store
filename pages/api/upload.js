// pages/api/upload.js
import { put } from '@vercel/blob';
import { IncomingForm } from 'formidable';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // Penting untuk menghandle multipart/form-data
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Gunakan formidable untuk parsing form data
    const form = new IncomingForm();

    // Parse request body
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve([fields, files]);
        }
      });
    });

    // Ambil file pertama dari field 'file'
    const file = files.file && files.file[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Baca file sebagai buffer
    const buffer = Buffer.from(file.buffer);

    // Upload ke Vercel Blob Storage
    const blob = await put(file.originalFilename, buffer, {
      contentType: file.mimetype,
      access: 'public',
    });

    // Kirim URL gambar sebagai respons JSON
    return res.status(200).json({ url: blob.url });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
