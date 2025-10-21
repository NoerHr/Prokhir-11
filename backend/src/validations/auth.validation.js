const { z } = require('zod'); // Pakai require

// Skema untuk 'register' (sesuaikan dengan Register.tsx)
const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Username tidak boleh kosong' })
      .min(3, 'Username minimal 3 karakter')
      .regex(/^\S*$/, 'Username tidak boleh mengandung spasi'),

    nim: z.string({ required_error: 'NIM tidak boleh kosong' })
      .min(8, 'NIM minimal 8 digit')
      .regex(/^[0-9]+$/, 'NIM harus berupa angka'),

    email: z.string({ required_error: 'Email tidak boleh kosong' })
      .email('Format email tidak valid'),

    password: z.string({ required_error: 'Password tidak boleh kosong' })
      .min(6, 'Password minimal 6 karakter'),

    contact: z.string().optional(),
  })
});

// Skema untuk 'login' (sesuaikan dengan Login.tsx)
const loginSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Username tidak boleh kosong' }),
    password: z.string({ required_error: 'Password tidak boleh kosong' }),
  })
});

// Gunakan module.exports
module.exports = {
  registerSchema,
  loginSchema,
};