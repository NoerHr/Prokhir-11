import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Item, Claimer } from './types';
import { Sidebar } from './components/Sidebar.tsx';
import { Beranda } from './pages/Beranda.tsx';
import { DaftarBarang } from './pages/DaftarBarang.tsx';
import { TambahBarang } from './pages/TambahBarang.tsx';
import { DetailBarang } from './pages/DetailBarang.tsx';
import { Statistik } from './pages/Statistik.tsx';


function App() {
    const [page, setPage] = useState<string>(() => localStorage.getItem('currentPage') || 'beranda');
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
        const saved = localStorage.getItem('selectedItem');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        localStorage.setItem('currentPage', page);
        if (page !== 'detail') {
            localStorage.removeItem('selectedItem');
            setSelectedItem(null);
        }
    }, [page]);
    
    useEffect(() => {
        if (selectedItem) {
            localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
        } else {
            localStorage.removeItem('selectedItem');
        }
    }, [selectedItem]);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/items');
            setItems(response.data);
        } catch (error) {
            alert("Gagal memuat data dari server. Pastikan server back-end berjalan.");
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);
    
    useEffect(() => {
        if (selectedItem) {
            const updatedItem = items.find(item => item.id === selectedItem.id);
            if (updatedItem && JSON.stringify(updatedItem) !== JSON.stringify(selectedItem)) {
                setSelectedItem(updatedItem);
            } else if (!updatedItem) {
                setSelectedItem(null);
                setPage('daftar');
            }
        }
    }, [items, selectedItem]);

    const handleAddItem = () => {
        fetchItems();
    };

    const handleClaimItem = async (itemId: number, claimerPhoto: File, claimerData: Omit<Claimer, 'photoUrl'|'claimedDate'>) => {
        const formData = new FormData();
        formData.append('name', claimerData.name);
        formData.append('nim', claimerData.nim);
        formData.append('claimerPhoto', claimerPhoto);
        try {
            await axios.patch(`http://localhost:3001/api/items/${itemId}/claim`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Barang berhasil diklaim!');
            await fetchItems();
        } catch (error) {
            alert('Gagal mengklaim barang.');
        }
    };

    const handleDeleteItem = async (itemId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus barang ini secara permanen? Tindakan ini tidak dapat diurungkan.')) {
            try {
                await axios.delete(`http://localhost:3001/api/items/${itemId}`);
                alert('Barang berhasil dihapus.');
                await fetchItems();
            } catch(error) {
                alert('Gagal menghapus barang.');
            }
        }
    };

    const renderPage = () => {
        switch (page) {
            case 'beranda': return <Beranda items={items} />;
            case 'daftar': return <DaftarBarang items={items} setPage={setPage} setSelectedItem={setSelectedItem} />;
            case 'tambah': return <TambahBarang setPage={setPage} onAddItem={handleAddItem} />;
            case 'statistik': return <Statistik items={items} />;
            case 'detail': return <DetailBarang item={selectedItem} setPage={setPage} onClaim={handleClaimItem} onDelete={handleDeleteItem} />;
            default: return <Beranda items={items} />;
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Sidebar currentPage={page} setPage={setPage} />
            <main className="flex-1 ml-64">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;