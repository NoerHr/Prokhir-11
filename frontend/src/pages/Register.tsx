import React, { useState } from "react";
import { api, API_ENDPOINTS } from "../config/api";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Jika field name, hapus spasi otomatis
    if (e.target.name === "name") {
      value = value.replace(/\s/g, ""); // Hapus semua spasi
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validasi username tanpa spasi
    if (/\s/.test(formData.name)) {
      setError("Username tidak boleh mengandung spasi");
      setIsLoading(false);
      return;
    }

    // Validasi panjang username
    if (formData.name.length < 3) {
      setError("Username minimal 3 karakter");
      setIsLoading(false);
      return;
    }

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        name: formData.name,
        nim: formData.nim,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
      });

      if (response.status === 201) {
        const authData = {
          ...response.data.user,
          token: response.data.token,
        };
        localStorage.setItem("authToken", JSON.stringify(authData));
        toast.success("Registrasi berhasil! Selamat datang.");
        onRegisterSuccess();
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registrasi gagal, server tidak merespons.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Registrasi User
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Daftar untuk mengakses fitur lengkap
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={3}
              pattern="^\S+$"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Asep"
            />
          </div>
          <div>
            <label
              htmlFor="nim"
              className="block text-sm font-medium text-gray-700"
            >
              NIM <span className="text-red-500">*</span>
            </label>
            <input
              id="nim"
              name="nim"
              type="text"
              value={formData.nim}
              onChange={handleChange}
              required
              pattern="\d{8,}"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="12345678"
            />
            <p className="mt-1 text-xs text-gray-500">Minimal 8 digit angka</p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Kontak (WA/Line)
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="08123456789"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="******"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="******"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login di sini
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-2">
          <Link
            to="/"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Kembali ke dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};
