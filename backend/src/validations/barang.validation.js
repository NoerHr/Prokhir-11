const { z } = require('zod'); // Pakai require

// Skema untuk membuat barang baru (POST /items)
const createBarangSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Nama barang tidak boleh kosong' })
      .min(3, 'Nama barang minimal 3 karakter'),
      
    description: z.string({ required_error: 'Deskripsi tidak boleh kosong' })
      .min(10, 'Deskripsi minimal 10 karakter'),
      
    // Category ID dikirim sebagai string dari form, kita ubah jadi angka
    category: z.coerce.number({ required_error: 'Kategori harus dipilih' })
      .int().positive('ID Kategori tidak valid'),
      
    finderName: z.string({ required_error: 'Nama penemu tidak boleh kosong' }),
    
    finderNim: z.string({ required_error: 'NIM penemu tidak boleh kosong' })
      .min(8, 'NIM penemu minimal 8 digit'),
      
    finderContact: z.string().optional(), // Kontak penemu boleh kosong
    
    foundDate: z.string({ required_error: 'Tanggal ditemukan tidak boleh kosong' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid (YYYY-MM-DD)'), // Validasi format YYYY-MM-DD
      
    foundTime: z.string({ required_error: 'Waktu ditemukan tidak boleh kosong' })
      .regex(/^\d{2}:\d{2}$/, 'Format waktu tidak valid (HH:MM)'), // Validasi format HH:MM
      
    location: z.string({ required_error: 'Lokasi ditemukan tidak boleh kosong' }),
  }),
  // Note: Validasi file (itemPhoto, finderPhoto) dilakukan oleh Multer
});

// Skema untuk mengklaim barang (POST /items/:id/claim)
const claimBarangSchema = z.object({
  params: z.object({
    // ID barang di URL harus angka
    id: z.coerce.number({ required_error: 'ID Barang di URL tidak valid' })
      .int().positive('ID Barang di URL harus angka positif'),
  }),
  body: z.object({
    name: z.string({ required_error: 'Nama penerima tidak boleh kosong' }),
    nim: z.string({ required_error: 'NIM penerima tidak boleh kosong' })
      .min(8, 'NIM penerima minimal 8 digit')
  }),
  // Note: Validasi file (claimerPhoto) dilakukan oleh Multer
});

// Skema untuk menghapus barang (DELETE /items/:id)
const deleteBarangSchema = z.object({
  params: z.object({
    // ID barang di URL harus angka
    id: z.coerce.number({ required_error: 'ID Barang di URL tidak valid' })
      .int().positive('ID Barang di URL harus angka positif'),
  }),
});

// Gunakan module.exports
module.exports = {
  createBarangSchema,
  claimBarangSchema,
  deleteBarangSchema,
};