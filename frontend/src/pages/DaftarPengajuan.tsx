import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ClaimRequest } from "../types";
import { ConfirmModal } from "../components/ConfirmModal";
import { API_ENDPOINTS } from "../config/api";
import api from "../config/api";

export const DaftarPengajuan = () => {
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchClaimRequests = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CLAIMS.LIST);
      setClaimRequests(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pengajuan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimRequests();
  }, []);

  const filteredRequests = claimRequests.filter((req) => {
    if (filter === "All") return true;
    return req.status === filter;
  });

  const handleUpdateStatus = async (
    claimId: number,
    status: "Approved" | "Rejected"
  ) => {
    setIsProcessing(true);
    try {
      const response = await axios.patch(
        `http://localhost:2006/claim-request/${claimId}/status`,
        {
          status,
          adminNote: adminNote || null,
        }
      );
      toast.success(response.data.message);
      setSelectedClaim(null);
      setAdminNote("");
      await fetchClaimRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memproses pengajuan");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = (claimId: number) => {
    setDeleteTarget(claimId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await axios.delete(
        `http://localhost:2006/claim-request/${deleteTarget}`
      );
      toast.success(response.data.message);
      await fetchClaimRequests();
      setSelectedClaim(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus pengajuan");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-center text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Daftar Pengajuan Pengambilan Barang
      </h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
            {status === "All" && ` (${claimRequests.length})`}
            {status === "Pending" &&
              ` (${
                claimRequests.filter((r) => r.status === "Pending").length
              })`}
            {status === "Approved" &&
              ` (${
                claimRequests.filter((r) => r.status === "Approved").length
              })`}
            {status === "Rejected" &&
              ` (${
                claimRequests.filter((r) => r.status === "Rejected").length
              })`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 font-semibold w-20">No</th>
              <th className="p-4 text-gray-600 font-semibold">Nama Barang</th>
              <th className="p-4 text-gray-600 font-semibold">Pengaju</th>
              <th className="p-4 text-gray-600 font-semibold">NIM</th>
              <th className="p-4 text-gray-600 font-semibold">
                Tanggal Pengajuan
              </th>
              <th className="p-4 text-gray-600 font-semibold">Status</th>
              <th className="p-4 text-gray-600 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((claim, index) => (
                <tr
                  key={claim.id}
                  className={
                    index !== filteredRequests.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  <td className="p-4 text-gray-700">{index + 1}</td>
                  <td className="p-4 text-gray-700 font-medium">
                    {claim.itemName}
                  </td>
                  <td className="p-4 text-gray-700">{claim.userName}</td>
                  <td className="p-4 text-gray-700">{claim.userNim}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(claim.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                        claim.status
                      )}`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-500">
                  Tidak ada pengajuan dengan status "{filter}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Detail Pengajuan</h2>
              <button
                onClick={() => handleDeleteClick(selectedClaim.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Hapus Pengajuan
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Barang</p>
                  <p className="font-semibold">{selectedClaim.itemName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                      selectedClaim.status
                    )}`}
                  >
                    {selectedClaim.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nama Pengaju</p>
                  <p className="font-semibold">{selectedClaim.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">NIM</p>
                  <p className="font-semibold">{selectedClaim.userNim}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Alasan Pengajuan</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded">
                    {selectedClaim.alasan}
                  </p>
                </div>
                {selectedClaim.buktiUrl && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Bukti Kepemilikan
                    </p>
                    <img
                      src={selectedClaim.buktiUrl}
                      alt="Bukti"
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                )}
                {selectedClaim.adminNote && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Catatan Admin</p>
                    <p className="mt-1 p-3 bg-blue-50 rounded">
                      {selectedClaim.adminNote}
                    </p>
                  </div>
                )}
              </div>

              {selectedClaim.status === "Pending" && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Catatan Admin (Opsional)
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tambahkan catatan jika diperlukan..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedClaim.id, "Approved")
                      }
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {isProcessing ? "Memproses..." : "Setujui"}
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedClaim.id, "Rejected")
                      }
                      disabled={isProcessing}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {isProcessing ? "Memproses..." : "Tolak"}
                    </button>
                  </div>
                </div>
              )}

              {selectedClaim.status === "Approved" && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Pengajuan telah disetujui
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    User dapat mengambil barang. Untuk menandai barang sudah
                    diambil, buka <strong>Detail Barang</strong> dan klik
                    "Tandai Sudah Diambil".
                  </p>
                </div>
              )}

              {selectedClaim.status === "Rejected" && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">
                    ✗ Pengajuan telah ditolak
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => {
                  setSelectedClaim(null);
                  setAdminNote("");
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Pengajuan?"
        message="Apakah Anda yakin ingin menghapus pengajuan ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        type="danger"
      />
    </div>
  );
};
