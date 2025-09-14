import React, { useState } from 'react';
import { Item, Claimer } from '../types';
import { TrashIcon } from '../components/Icons.tsx';
import { ClaimModal } from '../components/ClaimModal.tsx';

interface DetailBarangProps {
    item: Item | null;
    setPage: (page: string) => void;
    onClaim: (itemId: number, claimerPhoto: File, claimerData: Omit<Claimer, 'photoUrl' | 'claimedDate'>) => void;
    onDelete: (itemId: number) => void;
}

export const DetailBarang: React.FC<DetailBarangProps> = ({ item, setPage, onClaim, onDelete }) => {
    const [isClaimModalOpen, setClaimModalOpen] = useState(false);
    
    if (!item) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold">Barang tidak ditemukan</h1>
                <button onClick={() => setPage('daftar')} className="text-blue-600 hover:underline mt-4">Kembali ke Daftar Barang</button>
            </div>
        );
    }
    
    const calculateStorageDuration = () => {
        if (!item.createdAt) return 'N/A';
        
        const startDate = new Date(item.createdAt);
        const endDate = item.claimer ? new Date(item.claimer.claimedDate) : new Date();
        
        if (isNaN(startDate.getTime())) return 'Waktu tidak valid';

        let diff = Math.abs(endDate.getTime() - startDate.getTime());

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        return `${days} hari ${hours} jam`;
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div><span className="text-blue-600 cursor-pointer hover:underline" onClick={() => setPage('daftar')}>Daftar Barang</span><span className="mx-2 text-gray-400">/</span><span className="text-gray-600">Detail</span></div>
                <button onClick={() => onDelete(item.id)} className="flex items-center gap-2 border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><TrashIcon /> Hapus Barang</button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row gap-8">
                     <div className="w-full md:w-1/3 flex-shrink-0"><div className="w-full h-80 bg-gray-200 rounded-xl shadow-lg overflow-hidden"><img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/></div></div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                             <div><p className="text-sm text-gray-500">{item.category}</p><h1 className="text-4xl font-bold text-gray-800 mb-2">{item.name}</h1><p className="text-gray-600">{item.description}</p></div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${item.status === 'Ditemukan' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                        </div>
                        <div className="border-t border-gray-200 my-6"></div>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div><p className="text-gray-500">Tanggal Ditemukan</p><p className="font-semibold">{item.foundDate}</p></div>
                            <div><p className="text-gray-500">Lokasi Ditemukan</p><p className="font-semibold">{item.location}</p></div>
                            <div><p className="text-gray-500">Status</p><p className="font-semibold">{item.status}</p></div>
                             <div><p className="text-gray-500">Lama Tersimpan</p><p className="font-semibold">{calculateStorageDuration()}</p></div>
                        </div>
                         {item.status === 'Ditemukan' && <div className="text-right mt-6"><button onClick={() => setClaimModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700">Tandai Sudah Diambil</button></div>}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Penemu</h3>
                    <div className="flex items-center gap-4">
                        <img src={item.finder.photoUrl} alt={item.finder.name} className="w-20 h-20 rounded-full object-cover bg-gray-200"/>
                        <div><p className="font-bold">{item.finder.name}</p><p className="text-sm text-gray-600">NIM: {item.finder.nim}</p><p className="text-sm text-gray-600">Kontak: {item.finder.contact}</p></div>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-md">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Penerima</h3>
                    {item.claimer ? (
                        <div className="flex items-center gap-4">
                            <img src={item.claimer.photoUrl} alt={item.claimer.name} className="w-20 h-20 rounded-full object-cover bg-gray-200"/>
                             <div><p className="font-bold">{item.claimer.name}</p><p className="text-sm text-gray-600">NIM: {item.claimer.nim}</p><p className="text-sm text-gray-600">Tanggal Diambil: {item.claimer.claimedDate}</p></div>
                        </div>
                    ) : (<p className="text-gray-500 italic">Barang belum diambil.</p>)}
                </div>
            </div>
            {isClaimModalOpen && <ClaimModal item={item} onClose={() => setClaimModalOpen(false)} onClaim={onClaim} />}
        </div>
    );
};