export const TambahKategori = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Tambah Data Kategori Barang
      </h1>
      <form className="max-w-4xl space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            1. Informasi Kategori
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nama-barang"
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
                <option value={"true"}>Aktif</option>
                <option value={"false"}>Non-Aktif</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="deskripsi"
                required
                rows={3}
                className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            // disabled={}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
          >
            {"Simpan Data Kategori"}
          </button>
        </div>
      </form>
    </div>
  );
};
