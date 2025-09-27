require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dataBarang } = require("./data/barang.js");
const { dataKategoriBarang } = require("./data/kategoriBarang.js");
const { userData } = require("./data/user.js");

const app = express();
const port = process.env.PORT || 2006;

app.use(cors());
app.use(express.json());

app.get("/get-barang", (req, res) => {
  res.status(200).json({
    message: "Berhasil Mendapatkan data barang",
    data: dataBarang,
  });
});

app.get("/get-kategori-barang", (req, res) => {
  res.status(200).json({
    message: "Berhasil Mendapatkan data kategori barang",
    data: dataKategoriBarang,
  });
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  if (name === userData.name && password === userData.password) {
    res.status(200).json({
      message: "Login berhasil",
      user: userData,
    });
  } else {
    res.status(401).json({
      message: "Login gagal",
    });
  }
});

app.post("/create-barang", (req, res) => {
  res.status(201).json({
    message: "Berhasil Menambahkan data barang",
  });
});

app.post("/create-kategori", (req, res) => {
  res.status(201).json({
    message: "Berhasil Menambahkan data kategori",
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});