const claimRepository = require("../repositories/claimRepository");
const barangRepository = require("../repositories/barangRepository");
const userRepository = require("../repositories/userRepository");
const { uploadToCloudinary } = require("../config/cloudinary");

class ClaimController {
    async createClaimRequest(req, res) {
        try {
            const { itemId, userId, alasan } = req.body;

            const barang = await barangRepository.findById(itemId);
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

            const existingClaims = await claimRepository.findByItemId(itemId);
            const userHasPendingClaim = existingClaims.some(
                (claim) => claim.user_id === parseInt(userId) && claim.status === "Pending"
            );

            if (userHasPendingClaim) {
                return res.status(400).json({
                    message: "Anda sudah mengajukan klaim untuk barang ini",
                });
            }

            const user = await userRepository.findByNim(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User tidak ditemukan",
                });
            }

            let buktiUrl = null;
            if (req.file) {
                const buktiBuffer = req.file.buffer;
                buktiUrl = await uploadToCloudinary(
                    buktiBuffer,
                    "lost-and-found/bukti",
                    `bukti-${Date.now()}`
                );
            }

            const claimData = {
                itemId: parseInt(itemId),
                userId: user.id,
                alasan,
                buktiUrl: buktiUrl,
            };

            const newClaim = await claimRepository.create(claimData);

            res.status(201).json({
                message: "Pengajuan klaim berhasil dikirim",
                data: newClaim,
            });
        } catch (error) {
            console.error("Error in createClaimRequest:", error);
            res.status(500).json({
                message: "Terjadi kesalahan saat mengajukan klaim",
                error: error.message,
            });
        }
    }

    async getUserClaimRequests(req, res) {
        try {
            const { userId } = req.params;
            
            const user = await userRepository.findByNim(userId);
            if (!user) {
                return res.status(404).json({
                    message: "User tidak ditemukan",
                });
            }

            const claims = await claimRepository.findByUserId(user.id);

            res.status(200).json({
                message: "Berhasil mendapatkan daftar pengajuan",
                data: claims,
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat mengambil data pengajuan",
                error: error.message,
            });
        }
    }

    async getAllClaimRequests(req, res) {
        try {
            const claims = await claimRepository.findAll();

            res.status(200).json({
                message: "Berhasil mendapatkan semua pengajuan",
                data: claims,
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat mengambil data pengajuan",
                error: error.message,
            });
        }
    }

    async updateClaimStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, adminNote } = req.body;

            const claim = await claimRepository.findById(id);
            if (!claim) {
                return res.status(404).json({
                    message: "Pengajuan tidak ditemukan",
                });
            }

            const updateData = {
                status,
                adminNote: adminNote || null,
                processedAt: new Date().toISOString(),
            };

            const updatedClaim = await claimRepository.update(id, updateData);

            res.status(200).json({
                message: `Pengajuan berhasil ${status === "APPROVED" ? "disetujui" : "ditolak"}`,
                data: updatedClaim,
            });
        } catch (error) {
            res.status(500).json({
                message: "Terjadi kesalahan saat memproses pengajuan",
                error: error.message,
            });
        }
    }

    async deleteClaimRequest(req, res) {
        try {
            const { id } = req.params;

            const claim = await claimRepository.findById(id);
            if (!claim) {
                return res.status(404).json({
                    message: "Pengajuan tidak ditemukan",
                });
            }

            const deleted = await claimRepository.delete(id);

            if (deleted) {
                res.status(200).json({
                    message: "Pengajuan berhasil dihapus",
                });
            } else {
                res.status(500).json({
                    message: "Gagal menghapus pengajuan",
                });
            }
        } catch (error) {
            console.error("Error in deleteClaimRequest:", error);
            res.status(500).json({
                message: "Terjadi kesalahan saat menghapus pengajuan",
                error: error.message,
            });
        }
    }
}

module.exports = new ClaimController();
