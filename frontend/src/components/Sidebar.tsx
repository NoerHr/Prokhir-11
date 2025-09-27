import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, ListIcon, PlusSquareIcon, } from "./Icons.tsx";

// Props setPage dan currentPage sudah tidak dibutuhkan lagi
interface SidebarProps {
  [key: string]: { name: string; icon: React.FC; path: string };
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navItems = [
    { name: "Beranda", icon: <HomeIcon />, path: "/" },
    { name: "Daftar Barang", icon: <ListIcon />, path: "/daftar-barang" },
    { name: "Daftar Kategori", icon: <ListIcon />, path: "/daftar-kategori" },
    { name: "Tambah Barang", icon: <PlusSquareIcon />, path: "/tambah-barang" },
    { name: "Tambah Kategori", icon: <ListIcon />, path: "/tambah-kategori" },
    // { name: "Statistik", icon: <BarChartIcon />, path: "/statistik" },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col p-4 shadow-lg fixed">
      <h1 className="text-2xl font-bold text-gray-800 mb-10 px-2">
        Lost & Found
      </h1>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                // NavLink secara otomatis tahu halaman mana yang aktif
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-gray-600 font-medium transition-colors duration-200 ${
                    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
