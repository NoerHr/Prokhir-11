const barangRepository = require("../repositories/barangRepository");
const kategoriRepository = require("../repositories/kategoriRepository");
const { uploadToCloudinary } = require("../config/cloudinary");

class BarangController {
  async getAllBarang(req, res) {
    try {
      const rawItems = await barangRepository.findAll();

      const items = rawItems.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        foundDate: row.foundDate,
        status: row.status,
        imageUrl: row.imageUrl,
        location: row.location,
        kategoriBarang: {
          id: row.category.id,
          name: row.category.name,
        },
        finder: {
          name: row.finderName,
          nim: row.finderNim,
          contact: row.finderContact,
          photoUrl: row.finderPhotoUrl,
        },
        claimer: row.claimer_name
          ? {
              name: row.claimer_name,
              nim: row.claimer_nim,
              claimedDate: row.claimed_date,
              photoUrl: row.claimer_photo_url,
            }
          : null,
        createdAt: row.createdAt,
      }));

      res.status(200).json({
        message: "Berhasil mendapatkan data barang",
        data: { items },
      });
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data barang",
        error: error.message,
      });
    }
  }

  async createBarang(req, res) {
    try {
      const {
        name,
        description,
        category,
        finderName,
        finderNim,
        finderContact,
        foundDate,
        foundTime,
        location,
      } = req.body;

      const itemPhotoFile = req.files.itemPhoto[0];
      const finderPhotoFile = req.files.finderPhoto[0];

      const kategori = await kategoriRepository.findById(category);
      if (!kategori) {
        return res.status(404).json({
          message: "Kategori tidak ditemukan",
        });
      }

      const itemPhotoUrl = await uploadToCloudinary(
        req.files.itemPhoto[0].buffer,
        "lost-and-found/items",
        `item-${Date.now()}`
      );

      const finderPhotoUrl = await uploadToCloudinary(
        req.files.finderPhoto[0].buffer,
        "lost-and-found/finders",
        `finder-${Date.now()}`
      );

      const foundDateTime = `${foundDate} ${foundTime}:00+07`;

      const barangData = {
        name,
        description,
        category_id: kategori.id,
        found_date: foundDateTime,
        location,
        image_url: itemPhotoUrl,
        finder_name: finderName,
        finder_nim: finderNim,
        finder_contact: finderContact || "-",
        finder_photo_url: finderPhotoUrl,
      };

      const newBarang = await barangRepository.create(barangData);

      const responseData = {
        id: newBarang.id,
        name: newBarang.name,
        description: newBarang.description,
        foundDate: newBarang.found_date,
        status: newBarang.status,
        imageUrl: newBarang.image_url,
        location: newBarang.location,
        kategoriBarang: {
          id: kategori.id,
          name: kategori.name,
        },
        finder: {
          name: newBarang.finder_name,
          nim: newBarang.finder_nim,
          contact: newBarang.finder_contact,
          photoUrl: newBarang.finder_photo_url,
        },
      };

      res.status(201).json({
        message: "Berhasil menambahkan data barang",
        data: responseData,
      });
    } catch (error) {
      console.error("Error in createBarang:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat menambahkan barang",
        error: error.message,
      });
    }
  }

  async claimBarang(req, res) {
    try {
      const { id } = req.params;
      const { name, nim } = req.body;

      // File sudah dipastikan ada oleh Multer
      const claimerPhotoFile = req.file;

      const barang = await barangRepository.findById(id);
      if (!barang) {
        return res.status(404).json({
          message: "Barang tidak ditemukan",
        });
      }

      if (barang.status === "Diambil") {
        return res.status(400).json({
          message: "Barang sudah diambil",
        });
      }

      const claimerPhotoUrl = await uploadToCloudinary(
        req.file.buffer,
        "lost-and-found/claimers",
        `claimer-${Date.now()}`
      );

      const updateData = {
        status: "Diambil",
        claimer_name: name,
        claimer_nim: nim,
        claimer_photo_url: claimerPhotoUrl,
        claimed_date: new Date().toISOString(),
      };

      const updated = await barangRepository.update(id, updateData);

      const responseData = {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        claimer: {
          name: updated.claimer_name,
          nim: updated.claimer_nim,
          claimedDate: updated.claimed_date,
          photoUrl: updated.claimer_photo_url,
        },
      };

      res.status(200).json({
        message: "Berhasil mengklaim barang",
        data: responseData,
      });
    } catch (error) {
      console.error("Error in claimBarang:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengklaim barang",
        error: error.message,
      });
    }
  }

  async deleteBarang(req, res) {
    try {
      const { id } = req.params;

      const barang = await barangRepository.findById(id);
      if (!barang) {
        return res.status(404).json({
          message: "Barang tidak ditemukan",
        });
      }

      const deleted = await barangRepository.delete(id);

      if (deleted) {
        res.status(200).json({
          message: "Berhasil menghapus data barang",
        });
      } else {
        res.status(500).json({
          message: "Gagal menghapus data barang",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat menghapus barang",
        error: error.message,
      });
    }
  }
}

module.exports = new BarangController();
