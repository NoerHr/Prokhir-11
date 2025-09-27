import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import { Item, Claimer } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Beranda } from "./pages/Beranda";
import { DaftarBarang } from "./pages/DaftarBarang";
import { TambahBarang } from "./pages/TambahBarang";
import { DetailBarang } from "./pages/DetailBarang";
// import { Statistik } from "./pages/Statistik";
import { TambahKategori } from "./pages/TambahKategori";
import { DaftarKategori } from "./pages/DaftarKategori";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
    const saved = localStorage.getItem("selectedItem");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedItem) {
      localStorage.setItem("selectedItem", JSON.stringify(selectedItem));
    } else {
      localStorage.removeItem("selectedItem");
    }
  }, [selectedItem]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://192.168.1.4:2006/get-barang");
      console.log(response.data?.data?.items);
      setItems(response?.data?.data?.items);
    } catch (error) {
      console.log(error);
      alert(
        "Gagal memuat data dari server. Pastikan server back-end berjalan."
      );
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const updatedItem = items.find((item) => item.id === selectedItem.id);
      if (!updatedItem) {
        setSelectedItem(null);
        localStorage.removeItem("selectedItem");
        navigate("/daftar");
      } else if (JSON.stringify(updatedItem) !== JSON.stringify(selectedItem)) {
        setSelectedItem(updatedItem);
      }
    }
  }, [items, selectedItem, navigate]);

  const handleAddItem = () => {
    fetchItems();
  };

  const handleClaimItem = async (
    itemId: number,
    claimerPhoto: File,
    claimerData: Omit<Claimer, "photoUrl" | "claimedDate">
  ) => {
    const formData = new FormData();
    formData.append("name", claimerData.name);
    formData.append("nim", claimerData.nim);
    formData.append("claimerPhoto", claimerPhoto);
    try {
      await axios.patch(
        `http://localhost:3001/api/items/${itemId}/claim`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Barang berhasil diklaim!");
      await fetchItems();
    } catch (error) {
      console.log(error);
      alert("Gagal mengklaim barang.");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus barang ini secara permanen? Tindakan ini tidak dapat diurungkan."
      )
    ) {
      try {
        await axios.delete(`http://localhost:3001/api/items/${itemId}`);
        alert("Barang berhasil dihapus.");
        navigate("/daftar");
        await fetchItems();
      } catch (error) {
        console.log(error);
        alert("Gagal menghapus barang.");
      }
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Routes>
          <Route path="/" element={<Beranda items={items} />} />
          <Route
            path="/daftar-barang"
            element={
              <DaftarBarang items={items} setSelectedItem={setSelectedItem} />
            }
          />
          <Route path="/daftar-kategori" element={<DaftarKategori />} />
          <Route
            path="/tambah-barang"
            element={<TambahBarang onAddItem={handleAddItem} />}
          />
          <Route path="/tambah-kategori" element={<TambahKategori />} />
          {/* <Route path="/statistik" element={<Statistik items={items} />} /> */}
          <Route
            path="/detail"
            element={
              <DetailBarang
                item={selectedItem}
                onClaim={handleClaimItem}
                onDelete={handleDeleteItem}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
