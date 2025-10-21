// Gunakan require untuk Zod
const { z } = require('zod'); 

// Middleware ini akan menjalankan skema Zod
const validate = (schema) => 
  async (req, res, next) => {
  try {
    // Validasi data yang masuk (body, query, params)
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Jika lolos, lanjut ke controller
    return next();
  } catch (error) {
    // Jika gagal, kirim error 400 (Bad Request)
    // error.errors berisi pesan yang jelas dari Zod
    return res.status(400).json(error.errors);
  }
};

// Gunakan module.exports
module.exports = validate;