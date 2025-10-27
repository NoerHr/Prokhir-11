const { z } = require('zod'); // Pakai require

// Skema untuk membuat kategori baru (POST /categories)
const createKategoriSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Nama kategori tidak boleh kosong' })
      .min(3, 'Nama kategori minimal 3 karakter'),
      
    // Status bisa string 'true'/'false' atau boolean, kita ubah jadi boolean
    status: z.preprocess((val) => {
      if (typeof val === 'string') return val === 'true';
      return Boolean(val);
    }, z.boolean({ required_error: 'Status harus dipilih (Aktif/Non-Aktif)' })),
  }),
});

// Skema untuk update status kategori (PATCH /categories/:id/status)
const updateKategoriStatusSchema = z.object({
  params: z.object({
    // ID kategori di URL harus angka
    id: z.coerce.number({ required_error: 'ID Kategori di URL tidak valid' })
      .int().positive('ID Kategori di URL harus angka positif'),
  }),
  body: z.object({
    // Status bisa string 'true'/'false' atau boolean, kita ubah jadi boolean
    status: z.preprocess((val) => {
      if (typeof val === 'string') return val === 'true';
      return Boolean(val);
    }, z.boolean({ required_error: 'Status tidak boleh kosong' })),
  }),
});

// Skema untuk menghapus kategori (DELETE /categories/:id)
const deleteKategoriSchema = z.object({
  params: z.object({
    // ID kategori di URL harus angka
    id: z.coerce.number({ required_error: 'ID Kategori di URL tidak valid' })
      .int().positive('ID Kategori di URL harus angka positif'),
  }),
});

// Gunakan module.exports
module.exports = {
  createKategoriSchema,
  updateKategoriStatusSchema,
  deleteKategoriSchema,
};