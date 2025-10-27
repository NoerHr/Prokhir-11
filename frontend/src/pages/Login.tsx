import React, { useState } from "react";
import { api, API_ENDPOINTS } from "../config/api";
import { Link } from "react-router-dom";

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        name,
        password,
      });

      if (response.status === 200) {
        const authData = {
          ...response.data.user,
          token: response.data.token,
        };
        localStorage.setItem("authToken", JSON.stringify(authData));
        onLoginSuccess();
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login gagal, server tidak merespons.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-8">Masuk ke akun Anda</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Loading..." : "Masuk"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Daftar di sini
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
