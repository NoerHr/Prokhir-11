import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types'; // Pastikan path import ini sesuai

// Ikon untuk search bar
const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
);


interface DashboardUserProps {
    items: Item[];
}

export const DashboardUser: React.FC<DashboardUserProps> = ({ items }) => {
    // 1. State untuk menyimpan input dari pengguna
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua'); // Default 'Semua'

    // Hanya menampilkan barang yang berstatus 'Ditemukan'
    const foundItems = items.filter(item => item.status === 'Ditemukan');

    // Ambil daftar kategori unik dari data barang untuk pilihan filter
    const categories = useMemo(() => {
        const allCategories = foundItems.map(item => item.kategoriBarang.name);
        return ['Semua', ...new Set(allCategories)]; // Tambahkan 'Semua' di awal
    }, [foundItems]);

    // 2. Logika untuk memfilter barang berdasarkan search dan kategori
    const filteredItems = useMemo(() => {
        return foundItems.filter(item => {
            const matchesCategory = selectedCategory === 'Semua' || item.kategoriBarang.name === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [foundItems, searchTerm, selectedCategory]);
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Lost & Found Kampus</h1>
                    <Link 
                        to="/login" 
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </Link>
                </nav>
            </header>
            
            <main className="container mx-auto px-6 py-8">
                
                <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-12 py-16 px-8 flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
                    <div className="relative z-10">
                        <svg className="h-24 w-24 text-white mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>

                        <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                            Barang Hilang? Kami Bantu Temukan!
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Platform Lost & Found resmi kampus untuk membantu Anda menemukan barang-barang yang tercecer atau melaporkan barang yang Anda temukan.
                        </p>
                        <p className="text-md text-blue-200 mt-4">
                            Lihat daftar barang yang ditemukan di bawah ini. Jika itu milik Anda, segera hubungi kami melalui admisi!
                        </p>
                    </div>
                </section>

                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold text-gray-800">Daftar Barang Ditemukan</h2>
                </div>

                {/* 3. Form untuk Search dan Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white p-4 rounded-lg shadow">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-2/3">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari nama barang..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Filter Kategori */}
                    <div className="w-full md:w-1/3">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid Daftar Barang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <Link
                                to="/login"
                                key={item.id}
                                className="relative block bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-200"
                            >
                                {/* ... Tampilan Kartu Barang ... */}
                                <div className="w-full h-56 bg-gray-200">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/cccccc/333333?text=Tidak+Ada+Gambar'; }}/>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Ditemukan: {item.foundDate}</p>
                                    <p className="text-sm text-gray-500">Lokasi: {item.location}</p>
                                </div>
                                <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    {item.status}
                                </span>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                             <p className="text-gray-500 text-xl">
                                 Barang tidak ditemukan. Coba kata kunci atau filter yang lain.
                             </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};