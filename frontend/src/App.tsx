import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import axios from "axios";

import { Item, Claimer, User } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Beranda } from "./pages/Beranda";
import { DaftarBarang } from "./pages/DaftarBarang";
import { TambahBarang } from "./pages/TambahBarang";
import { DetailBarang } from "./pages/DetailBarang";
import { TambahKategori } from "./pages/TambahKategori";
import { DaftarKategori } from "./pages/DaftarKategori";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { DashboardUser } from "./pages/DashboardUser";
import { DashboardUserLoggedIn } from "./pages/DashboardUserLoggedIn";
import { DaftarPengajuan } from "./pages/DaftarPengajuan";
import { toast } from "react-hot-toast";

// Komponen untuk Melindungi Rute Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const authData = localStorage.getItem("authToken");
  if (!authData) return <Navigate to="/login" replace />;

  const user = JSON.parse(authData) as User;
  if (user.role !== "admin") return <Navigate to="/user/dashboard" replace />;

  return <>{children}</>;
};

// Komponen untuk Melindungi Rute User
const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const authData = localStorage.getItem("authToken");
  if (!authData) return <Navigate to="/login" replace />;

  const user = JSON.parse(authData) as User;
  if (user.role !== "user") return <Navigate to="/admin/beranda" replace />;

  return <>{children}</>;
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
    const saved = localStorage.getItem("selectedItem");
    return saved ? JSON.parse(saved) : null;
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("authToken");
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
      const response = await axios.get("http://localhost:2006/get-barang");
      setItems(response?.data?.data?.items || []);
    } catch (error) {
      console.log(error);
      alert("Gagal memuat data dari server. Pastikan server back-end berjalan.");
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
        navigate("/admin/daftar-barang");
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
      const response = await axios.post(
        `http://localhost:2006/claim-barang/${itemId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data?.message);
      await fetchItems();
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengklaim barang.");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus barang ini secara permanen? Tindakan ini tidak dapat diurungkan."
      )
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:2006/delete-barang/${itemId}`
        );
        toast.success(response.data?.message);
        await fetchItems();
        return navigate("/admin/daftar-barang");
      } catch (error) {
        console.log(error);
        toast.error("Gagal menghapus barang.");
      }
    }
  };

  const handleLoginSuccess = () => {
    const authData = localStorage.getItem("authToken");
    if (authData) {
      const userData = JSON.parse(authData) as User;
      setUser(userData);
      if (userData.role === "admin") {
        navigate("/admin/beranda");
      } else {
        navigate("/user/dashboard");
      }
    }
  };

  const handleRegisterSuccess = () => {
    const authData = localStorage.getItem("authToken");
    if (authData) {
      const userData = JSON.parse(authData) as User;
      setUser(userData);
      navigate("/user/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  };

  // Komponen Layout Admin
  const AdminLayout: React.FC = () => (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );

  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<DashboardUser items={items} />} />
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/register"
        element={<Register onRegisterSuccess={handleRegisterSuccess} />}
      />

      {/* Rute User Logged In */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedUserRoute>
            <DashboardUserLoggedIn
              items={items}
              user={user!}
              onLogout={handleLogout}
            />
          </ProtectedUserRoute>
        }
      />

      {/* Rute Admin dengan Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route path="beranda" element={<Beranda items={items} />} />
        <Route
          path="daftar-barang"
          element={<DaftarBarang items={items} setSelectedItem={setSelectedItem} />}
        />
        <Route path="daftar-kategori" element={<DaftarKategori />} />
        <Route path="daftar-pengajuan" element={<DaftarPengajuan />} />
        <Route
          path="tambah-barang"
          element={<TambahBarang onAddItem={handleAddItem} />}
        />
        <Route path="tambah-kategori" element={<TambahKategori />} />
        <Route
          path="detail"
          element={
            <DetailBarang
              item={selectedItem}
              onClaim={handleClaimItem}
              onDelete={handleDeleteItem}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
