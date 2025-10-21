const { z } = require('zod'); // Pakai require

// Skema untuk membuat pengajuan klaim (POST /claims)
const createClaimSchema = z.object({
  body: z.object({
    // itemId datang sebagai string dari FormData, ubah jadi angka
    itemId: z.coerce.number({ required_error: 'ID Barang tidak boleh kosong' })
      .int().positive('ID Barang tidak valid'),

    // userId (NIM) datang sebagai string dari FormData
    userId: z.string({ required_error: 'NIM pengguna tidak boleh kosong' })
      .min(8, 'NIM pengguna minimal 8 digit') // Samakan dengan skema user
      .regex(/^[0-9]+$/, 'NIM pengguna harus berupa angka'), // Samakan dengan skema user

    alasan: z.string({ required_error: 'Alasan pengajuan tidak boleh kosong' })
      .min(10, 'Alasan pengajuan terlalu pendek (minimal 10 karakter)')
      .max(500, 'Alasan pengajuan terlalu panjang (maksimal 500 karakter)'),
  }),
  // Validasi file 'bukti' ditangani oleh Multer
});

// Skema untuk mengambil klaim berdasarkan ID user (GET /claims/user/:userId)
const getUserClaimsSchema = z.object({
  params: z.object({
    // userId (NIM) di URL
    userId: z.string({ required_error: 'NIM pengguna di URL tidak boleh kosong' })
      .min(8, 'NIM pengguna di URL minimal 8 digit')
      .regex(/^[0-9]+$/, 'NIM pengguna di URL harus berupa angka'),
  }),
});

// Skema untuk update status klaim (PATCH /claims/:id/status)
const updateClaimStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number({ required_error: 'ID Pengajuan di URL tidak valid' })
      .int().positive('ID Pengajuan di URL harus angka positif'),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED'], {
      required_error: 'Status tidak boleh kosong',
      invalid_type_error: "Status harus 'Approved' atau 'Rejected'",
    }),
    adminNote: z.string().optional(), // adminNote boleh kosong
  }),
});

// Skema untuk menghapus pengajuan klaim (DELETE /claims/:id)
const deleteClaimSchema = z.object({
  params: z.object({
    id: z.coerce.number({ required_error: 'ID Pengajuan di URL tidak valid' })
      .int().positive('ID Pengajuan di URL harus angka positif'),
  }),
});

// Gunakan module.exports
module.exports = {
  createClaimSchema,
  getUserClaimsSchema,
  updateClaimStatusSchema,
  deleteClaimSchema,
};