const kategoriRepository = require("../repositories/kategoriRepository");

class KategoriController {
    async getAllKategori(req, res) {
        try {
            const data = await kategoriRepository.findAll();
            res.status(200).json({
                message: "Berhasil mendapatkan data kategori barang",
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat mengambil data kategori",
                error: error.message,
            });
        }
    }

    async createKategori(req, res) {
        try {
            const { name, status } = req.body;

            const kategoriData = {
                name,
                status,
            };

            const newKategori = await kategoriRepository.create(kategoriData);

            res.status(201).json({
                message: "Berhasil menambahkan data kategori",
                data: newKategori,
            });
        } catch (error) {
            console.error("Error in createKategori:", error);
            res.status(500).json({
                message: "Terjadi kesalahan saat menambahkan kategori",
                error: error.message,
            });
        }
    }

    async updateKategoriStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const kategori = await kategoriRepository.findById(id);
            if (!kategori) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan",
                });
            }

            const updated = await kategoriRepository.updateStatus(id, status);

            if (updated) {
                res.status(200).json({
                    message: "Berhasil mengubah status kategori",
                    data: updated,
                });
            } else {
                res.status(500).json({
                    message: "Gagal mengubah status kategori",
                });
            }
        } catch (error) {
            console.error("Error in updateKategoriStatus:", error);
            res.status(500).json({
                message: "Terjadi kesalahan saat mengubah status kategori",
                error: error.message,
            });
        }
    }

    async deleteKategori(req, res) {
        try {
            const { id } = req.params;

            const kategori = await kategoriRepository.findById(id);
            if (!kategori) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan",
                });
            }

            const deleted = await kategoriRepository.delete(id);

            if (deleted) {
                res.status(200).json({
                    message: "Berhasil menghapus data kategori barang",
                });
            } else {
                res.status(500).json({
                    message: "Gagal menghapus data kategori",
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat menghapus kategori",
                error: error.message,
            });
        }
    }
}

module.exports = new KategoriController();
