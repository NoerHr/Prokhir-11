import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api, API_ENDPOINTS } from "../config/api";

export const TambahKategori = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const kategoriData = {
        name: formData.get("name"),
        status: formData.get("status") === "true",
      };

      const response = await api.post(
        API_ENDPOINTS.CATEGORIES.CREATE,
        kategoriData
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        if (formRef.current) {
          formRef.current.reset();
        }
        return navigate("/admin/daftar-kategori");
      }
    } catch (error: any) {
      console.error("Error details:", error.response?.data);

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        validationErrors.forEach((err: any) => {
          toast.error(`${err.path?.[1] || "Field"}: ${err.message}`);
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat menambahkan kategori."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Tambah Data Kategori Barang
      </h1>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Informasi Kategori
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nama-kategori"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                id="nama-kategori"
                required
                className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Elektronik"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                id="status"
                required
                className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Aktif</option>
                <option value="false">Non-Aktif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
          >
            {isLoading ? "Menyimpan..." : "Simpan Data Kategori"}
          </button>
        </div>
      </form>
    </div>
  );
};
