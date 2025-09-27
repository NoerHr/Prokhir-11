const { dataKategoriBarang } = require("./kategoriBarang.js");

const dataBarang = {
  items: [
    {
      id: 1,
      name: "Headphone Nirkabel",
      description:
        "Headphone hitam merk Sony, ditemukan di dekat rak buku fiksi.",
      kategoriBarang: {
        id: dataKategoriBarang[0].id,
        name: dataKategoriBarang[0].name,
      },
      foundDate: "2025-09-10",
      status: "Ditemukan",
      imageUrl: "https://placehold.co/300x300/fecaca/313442?text=Headphone",
      location: "Perpustakaan Lt. 2",
      createdAt: "2025-09-10T10:30:00Z",
      finder: {
        name: "Budi Santoso",
        nim: "210123456",
        contact: "08123456789",
        photoUrl: "https://placehold.co/100x100/A8A29E/FFFFFF?text=Budi",
      },
      claimer: null,
    },
    {
      id: 2,
      name: "Buku Catatan",
      description: "Buku catatan bersampul putih dengan stiker dinosaurus.",
      kategoriBarang: {
        id: dataKategoriBarang[1].id,
        name: dataKategoriBarang[1].name,
      },
      foundDate: "2025-09-08",
      status: "Diambil",
      imageUrl: "https://placehold.co/300x300/f3f4f6/313442?text=Buku",
      location: "Ruang Kelas 101",
      createdAt: "2025-09-08T14:00:00Z",
      finder: {
        name: "Joko Susilo",
        nim: "220543210",
        contact: "08567891234",
        photoUrl: "https://placehold.co/100x100/A8A29E/FFFFFF?text=Joko",
      },
      claimer: {
        name: "Maria Selena",
        nim: "220112233",
        claimedDate: "2025-09-09",
        photoUrl: "https://placehold.co/100x100/E7E5E4/FFFFFF?text=Maria",
      },
    },
    {
      id: 3,
      name: "Dokumen Rahasia",
      description: "Dokumen penting yang ditemukan di ruang kelas.",
      kategoriBarang: {
        id: dataKategoriBarang[2].id,
        name: dataKategoriBarang[2].name,
      },
      foundDate: "2025-09-08",
      status: "Diambil",
      imageUrl: "https://placehold.co/300x300/f3f4f6/313442?text=Dokumen",
      location: "Ruang Kelas 102",
      createdAt: "2025-09-08T14:00:00Z",
      finder: {
        name: "Ahmad Fauzi",
        nim: "220543211",
        contact: "08567891235",
        photoUrl: "https://placehold.co/100x100/A8A29E/FFFFFF?text=Ahmad",
      },
      claimer: {
        name: "Siti Nurhaliza",
        nim: "220112234",
        claimedDate: "2025-09-10",
        photoUrl: "https://placehold.co/100x100/E7E5E4/FFFFFF?text=Siti",
      },
    },
  ],
};

module.exports = { dataBarang };
