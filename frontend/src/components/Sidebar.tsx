import React from 'react';
import { HomeIcon, ListIcon, PlusSquareIcon, BarChartIcon } from './Icons.tsx';

interface SidebarProps {
    currentPage: string;
    setPage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
    const navItems = [
        { name: 'Beranda', icon: <HomeIcon />, page: 'beranda' },
        { name: 'Daftar Barang', icon: <ListIcon />, page: 'daftar' },
        { name: 'Tambah Barang', icon: <PlusSquareIcon />, page: 'tambah' },
        { name: 'Statistik', icon: <BarChartIcon />, page: 'statistik' },
    ];

    return (
        <div className="w-64 bg-white h-screen flex flex-col p-4 shadow-lg fixed">
            <h1 className="text-2xl font-bold text-gray-800 mb-10 px-2">Lost & Found</h1>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setPage(item.page); }} className={`flex items-center space-x-3 p-3 rounded-lg text-gray-600 font-medium transition-colors duration-200 ${ currentPage === item.page ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100' }`} >
                                {item.icon}
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};