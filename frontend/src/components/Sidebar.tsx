import React from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, ListIcon, PlusSquareIcon, LogOutIcon } from "./Icons.tsx";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { name: "Beranda", icon: <HomeIcon />, path: "/admin/beranda" },
    { name: "Daftar Barang", icon: <ListIcon />, path: "/admin/daftar-barang" },
    { name: "Daftar Kategori", icon: <ListIcon />, path: "/admin/daftar-kategori" },
    { name: "Tambah Barang", icon: <PlusSquareIcon />, path: "/admin/tambah-barang" },
    { name: "Tambah Kategori", icon: <ListIcon />, path: "/admin/tambah-kategori" },
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
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 text-left p-3 rounded-lg text-gray-600 font-medium hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
        >
          <LogOutIcon />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
