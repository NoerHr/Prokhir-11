import { useState, useEffect } from "react";
import { SearchIcon, TrashIcon } from "../components/Icons";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

export const DaftarKategori = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2006/get-kategori-barang"
        );
        setCategories(response.data?.data || []);
        console.log(response.data?.data);
      } catch (error) {
        console.log(error);
        alert("Gagal memuat data kategori dari server.");
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = (categoryId: number) => async () => {
    try {
      const response = await axios.delete(
        `http://localhost:2006/delete-kategori-barang/${categoryId}`
      );
      if (
        window.confirm(
          "Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat diurungkan."
        )
      ) {
        toast.success(response.data?.message);
        return navigate("/admin/daftar-kategori");
      }
    } catch (error) {
      console.log(error);
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
              <th className="p-4 text-gray-600 font-semibold  text-center">
                ID
              </th>
              <th className="p-4 text-gray-600 font-semibold  text-center">
                Nama Kategori
              </th>
              <th className="p-4 text-gray-600 font-semibold  text-center">
                Status
              </th>
              <th></th>
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
                    {category.id}
                  </td>
                  <td className="p-4 text-gray-700 font-medium text-center">
                    {category.name}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      Aktif
                    </span>
                  </td>
                  <td className="flex justify-center items-center p-4">
                    <button
                      className="flex items-center gap-2 border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-colors w-fit"
                      onClick={handleDeleteCategory(category.id)}
                    >
                      <TrashIcon /> Hapus Barang
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-8 text-gray-500">
                  Tidak ada kategori yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
