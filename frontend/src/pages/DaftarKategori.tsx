import { useState, useEffect } from "react";
import { SearchIcon, TrashIcon } from "../components/Icons";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";
import api from "../config/api";
import { API_ENDPOINTS } from "../config/api";

interface Category {
  id: number;
  name: string;
  description?: string;
  status?: boolean;
  created_at?: string;
}

export const DaftarKategori = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
      setCategories(response.data?.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Gagal memuat data kategori dari server.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (categoryId: number) => {
    setDeleteTarget(categoryId);
  };

  const handleConfirmDelete = async () => {
  if (!deleteTarget) return;
  try {
    // Gunakan api dan API_ENDPOINTS
    const response = await api.delete(
      API_ENDPOINTS.CATEGORIES.DELETE(deleteTarget) 
    );
    toast.success(response.data?.message);
    await fetchCategories();
  } catch (error: any) { // Tambahkan 'any' untuk tipe error
    console.log(error);
    toast.error(error.response?.data?.message || "Gagal menghapus kategori.");
  } finally {
    setDeleteTarget(null);
  }
};

  const handleToggleStatus = async (
    categoryId: number,
    currentStatus: boolean
  ) => {
    try {
      const response = await api.patch(
        API_ENDPOINTS.CATEGORIES.UPDATE_STATUS(categoryId),
        { status: !currentStatus }
      );
      toast.success(response.data?.message);
      await fetchCategories();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Gagal mengubah status kategori.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800">Daftar Kategori</h1>
      <p className="text-gray-500 mt-2 mb-8">
        Telusuri daftar kategori barang yang ditemukan...
      </p>
      <div className="relative w-full md:w-1/3 mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Cari kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 font-semibold text-center w-20">
                No
              </th>
              <th className="p-4 text-gray-600 font-semibold text-center">
                Nama Kategori
              </th>
              <th className="p-4 text-gray-600 font-semibold text-center">
                Status
              </th>
              <th className="p-4 text-gray-600 font-semibold text-center w-40">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className={
                    index !== filteredCategories.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                >
                  <td className="p-4 text-gray-700 font-medium text-center">
                    {index + 1}
                  </td>
                  <td className="p-4 text-gray-700 font-medium text-center">
                    {category.name}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleToggleStatus(
                          category.id,
                          category.status || false
                        )
                      }
                      className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                        category.status
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {category.status ? "Aktif" : "Non-Aktif"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <button
                        className="flex items-center gap-2 border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        onClick={() => handleDeleteClick(category.id)}
                      >
                        <TrashIcon /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  Tidak ada kategori yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Kategori?"
        message="Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat diurungkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        type="danger"
      />
    </div>
  );
};
