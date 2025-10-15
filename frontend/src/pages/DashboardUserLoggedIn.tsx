import React, { useState, useMemo } from "react";
import { Item, User, ClaimRequest } from "../types";
import axios from "axios";
import { toast } from "react-hot-toast";
import { formatDateTime } from '../utils/dateUtils';
import { ConfirmModal } from '../components/ConfirmModal';

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

interface DashboardUserLoggedInProps {
  items: Item[];
  user: User;
  onLogout: () => void;
}

interface ClaimModalProps {
  item: Item;
  user: User;
  onClose: () => void;
  onSubmit: (itemId: number, alasan: string, bukti: File | null) => void;
}

const ClaimModal: React.FC<ClaimModalProps> = ({ item, user, onClose, onSubmit }) => {
  const [alasan, setAlasan] = useState("");
  const [bukti, setBukti] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!alasan.trim()) {
      toast.error("Harap isi alasan pengajuan");
      return;
    }
    onSubmit(item.id, alasan, bukti);
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Pengajuan Pengambilan Barang</h2>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Barang:</p>
          <p className="font-bold text-lg">{item.name}</p>
          <p className="text-sm text-gray-600 mt-2">
            Ditemukan: {formatDateTime(item.foundDate)}
          </p>
          <p className="text-sm text-gray-600">Lokasi: {item.location}</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Anda
            </label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              NIM Anda
            </label>
            <input
              type="text"
              value={user.nim}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Alasan Pengajuan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              rows={4}
              placeholder="Jelaskan mengapa barang ini milik Anda..."
              className="w-full p-2 border rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Bukti Kepemilikan (Opsional)
            </label>
            <input
              type="file"
              onChange={(e) => e.target.files && setBukti(e.target.files[0])}
              className="block w-full text-sm text-gray-700 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:bg-blue-50 file:text-blue-700 file:font-semibold file:border-none file:px-4 file:py-2 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload foto atau dokumen pendukung
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Kirim Pengajuan
          </button>
        </div>
      </div>
    </div>
  );
};

export const DashboardUserLoggedIn: React.FC<DashboardUserLoggedInProps> = ({
  items,
  user,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [myRequests, setMyRequests] = useState<ClaimRequest[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const foundItems = items.filter((item) => item.status === "Ditemukan");

  const categories = useMemo(() => {
    const allCategories = foundItems.map((item) => item.kategoriBarang.name);
    return ["Semua", ...new Set(allCategories)];
  }, [foundItems]);

  const filteredItems = useMemo(() => {
    return foundItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "Semua" || item.kategoriBarang.name === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foundItems, searchTerm, selectedCategory]);

  const handleClaimSubmit = async (itemId: number, alasan: string, bukti: File | null) => {
    try {
      const formData = new FormData();
      formData.append("itemId", itemId.toString());
      formData.append("userId", user.nim);
      formData.append("alasan", alasan);
      if (bukti) {
        formData.append("bukti", bukti);
      }

      const response = await axios.post("http://localhost:2006/claim-request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Pengajuan berhasil dikirim!");
        setSelectedItem(null);
        fetchMyRequests();
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal mengirim pengajuan");
      }
    }
  };

  const fetchMyRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2006/claim-requests/user/${user.nim}`
      );
      setMyRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleShowMyRequests = () => {
    fetchMyRequests();
    setShowMyRequests(true);
  };

  const handleDeleteClick = (requestId: number) => {
    setDeleteTarget(requestId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await axios.delete(
        `http://localhost:2006/claim-request/${deleteTarget}`
      );
      toast.success(response.data.message);
      await fetchMyRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus pengajuan");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Lost & Found</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">NIM: {user.nim}</p>
              </div>
            </div>
            <button
              onClick={handleShowMyRequests}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Pengajuan Saya
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOutIcon /> Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-12 py-16 px-8 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Selamat Datang, {user.name.split(" ")[0]}!
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Temukan barang Anda dan ajukan pengambilan dengan mudah
            </p>
          </div>
        </section>

        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Daftar Barang Ditemukan</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="relative w-full md:w-2/3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Cari nama barang..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="relative block bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="w-full h-56 bg-gray-200">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Ditemukan: {formatDateTime(item.foundDate)}
                  </p>
                  <p className="text-sm text-gray-500">Lokasi: {item.location}</p>
                  <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ajukan Pengambilan
                  </button>
                </div>
                <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {item.status}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 text-xl">
                Barang tidak ditemukan. Coba kata kunci atau filter yang lain.
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedItem && (
        <ClaimModal
          item={selectedItem}
          user={user}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleClaimSubmit}
        />
      )}

      {showMyRequests && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Pengajuan Saya</h2>
              <button
                onClick={() => setShowMyRequests(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {myRequests.length > 0 ? (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{request.itemName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{request.alasan}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Diajukan: {new Date(request.createdAt).toLocaleDateString("id-ID")}
                        </p>
                        {request.adminNote && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500 font-semibold">Catatan Admin:</p>
                            <p className="text-sm text-gray-700">{request.adminNote}</p>
                          </div>
                        )}
                        
                        {/* Info status Approved */}
                        {request.status === "Approved" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm text-green-800 font-semibold">
                              ✓ Pengajuan Disetujui
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              Silakan hubungi admin untuk mengambil barang. 
                              Bawa identitas (KTM) dan bukti kepemilikan saat pengambilan.
                            </p>
                          </div>
                        )}

                        {/* Info status Rejected */}
                        {request.status === "Rejected" && request.adminNote && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800 font-semibold">
                              ✗ Pengajuan Ditolak
                            </p>
                            <p className="text-xs text-red-700 mt-1">
                              Silakan periksa catatan admin di atas untuk informasi lebih lanjut.
                            </p>
                          </div>
                        )}

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDeleteClick(request.id)}
                          className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Hapus Pengajuan
                        </button>
                      </div>
                      <span
                        className={`ml-4 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                          request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status === "Pending" && "Menunggu"}
                        {request.status === "Approved" && "Disetujui"}
                        {request.status === "Rejected" && "Ditolak"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Anda belum memiliki pengajuan
              </p>
            )}
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
