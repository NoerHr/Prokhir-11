import { SearchIcon } from "../components/Icons";
export const DaftarKategori = () => {
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
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-600 font-semibold">Nama Kategori</th>
              <th className="p-4 text-gray-600 font-semibold">Deskripsi</th>

              <th className="p-4 text-gray-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className={"border-b border-gray-200"}>
              <td className="p-4 text-gray-700 font-medium">Alat tulis</td>
              <td className="p-4 text-gray-600">
                Alat tulis dan perlengkapannya
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700`}
                >
                  Aktif
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
