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
            const { name, description, status } = req.body;

            if (!name || !description || status === undefined) {
                return res.status(400).json({
                    message: "Data kategori tidak lengkap",
                });
            }

            let statusBoolean;
            if (typeof status === 'string') {
                statusBoolean = status === 'true';
            } else if (typeof status === 'boolean') {
                statusBoolean = status;
            } else {
                statusBoolean = Boolean(status);
            }

            const kategoriData = {
                name,
                description,
                status: statusBoolean,
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

            if (status === undefined) {
                return res.status(400).json({
                    message: "Status tidak boleh kosong",
                });
            }

            const statusBoolean = typeof status === 'string' ? status === 'true' : Boolean(status);

            const kategori = await kategoriRepository.findById(id);
            if (!kategori) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan",
                });
            }

            const updated = await kategoriRepository.updateStatus(id, statusBoolean);

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
