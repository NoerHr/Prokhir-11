import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../types';

interface DashboardUserProps {
    items: Item[];
}

export const DashboardUser: React.FC<DashboardUserProps> = ({ items }) => {
    const foundItems = items.filter(item => item.status === 'Ditemukan');

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Lost & Found</h1>
                    <Link to="/login" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Admin Login
                    </Link>
                </nav>
            </header>
            
            <main className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-800">Barang Ditemukan</h2>
                    <p className="text-gray-600 mt-2">Berikut adalah daftar barang yang telah ditemukan dan diamankan. Silakan kunjungi kantor Lost & Found untuk informasi lebih lanjut.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
                    {foundItems.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="w-full h-56 bg-gray-200">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x300/cccccc/333333?text=Error'; }}/>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Ditemukan pada: {item.foundDate}</p>
                                <p className="text-sm text-gray-500">Lokasi: {item.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 {foundItems.length === 0 && (
                    <p className="text-center text-gray-500 mt-16">Saat ini tidak ada barang yang dilaporkan hilang.</p>
                )}
            </main>
        </div>
    );
};