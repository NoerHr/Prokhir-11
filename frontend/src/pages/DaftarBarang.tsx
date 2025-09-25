import React, { useState } from 'react';
import { Item } from '../types';
import { SearchIcon } from '../components/Icons.tsx';

interface DaftarBarangProps {
    items: Item[];
    setPage: (page: string) => void;
    setSelectedItem: (item: Item) => void;
}

export const DaftarBarang: React.FC<DaftarBarangProps> = ({ items, setPage, setSelectedItem }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const filters = ['Semua', 'Elektronik', 'Dokumen', 'Barang Pribadi', 'Lainnya'];
    const filteredItems = items.filter(item => (item.name.toLowerCase().includes(searchTerm.toLowerCase())) && (activeFilter === 'Semua' || item.category === activeFilter));
    const handleCardClick = (item: Item) => { setSelectedItem(item); setPage('detail'); };

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800">Daftar Barang</h1>
            <p className="text-gray-500 mt-2 mb-8">Telusuri daftar barang yang ditemukan...</p>
            <div className="relative w-full md:w-1/3 mb-6"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span><input type="text" placeholder="Cari barang..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="flex flex-wrap gap-2 mb-8">{filters.map(filter => (<button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{filter}</button>))}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-200" onClick={() => handleCardClick(item)}>
                        <div className="w-full h-48 bg-gray-200"><img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/cccccc/333333?text=Error'; }}/></div>
                        <div className="p-4"><h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3><p className="text-sm text-gray-500 mt-1">Ditemukan: {item.foundDate}</p><p className="text-sm text-gray-500">Lokasi: {item.location}</p></div>
                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${item.status === 'Ditemukan' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};