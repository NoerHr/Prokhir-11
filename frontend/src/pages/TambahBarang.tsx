import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface TambahBarangProps {
    onAddItem: () => void;
}

export const TambahBarang: React.FC<TambahBarangProps> = ({onAddItem}) => {
    const [itemPhoto, setItemPhoto] = useState<File | null>(null);
    const [finderPhoto, setFinderPhoto] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        if (!itemPhoto || !finderPhoto) {
            alert('Harap unggah foto barang dan foto penemu.');
            setIsLoading(false);
            return;
        }
        formData.append('itemPhoto', itemPhoto);
        formData.append('finderPhoto', finderPhoto);
        try {
            const response = await axios.post('http://localhost:3001/api/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.status === 201) {
                alert('Barang baru berhasil ditambahkan!');
                onAddItem();
                navigate('/daftar');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menambahkan barang.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Tambah Data Barang Hilang</h1>
            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">1. Informasi Barang</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="nama-barang" className="block text-sm font-medium text-gray-600 mb-1">Nama Barang <span className="text-red-500">*</span></label><input name="name" type="text" id="nama-barang" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"/></div>
                        <div><label htmlFor="kategori" className="block text-sm font-medium text-gray-600 mb-1">Kategori <span className="text-red-500">*</span></label><select name="category" id="kategori" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"><option value="Elektronik">Elektronik</option><option value="Dokumen">Dokumen</option><option value="Barang Pribadi">Barang Pribadi</option><option value="Lainnya">Lainnya</option></select></div>
                        <div className="md:col-span-2"><label htmlFor="deskripsi" className="block text-sm font-medium text-gray-600 mb-1">Deskripsi <span className="text-red-500">*</span></label><textarea name="description" id="deskripsi" required rows={3} className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea></div>
                        <div><label className="block text-sm font-medium text-gray-600 mb-1">Foto Barang <span className="text-red-500">*</span></label><input type="file" required onChange={(e) => e.target.files && setItemPhoto(e.target.files[0])} className="block w-full text-sm text-gray-700 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:bg-blue-50 file:text-blue-700 file:font-semibold file:border-none file:px-4 file:py-2 hover:file:bg-blue-100"/></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">2. Informasi Penemu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="nama-penemu" className="block text-sm font-medium text-gray-600 mb-1">Nama Penemu <span className="text-red-500">*</span></label><input name="finderName" type="text" id="nama-penemu" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"/></div>
                        <div><label htmlFor="nim-penemu" className="block text-sm font-medium text-gray-600 mb-1">NIM Penemu <span className="text-red-500">*</span></label><input name="finderNim" type="text" id="nim-penemu" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"/></div>
                        <div><label htmlFor="kontak-penemu" className="block text-sm font-medium text-gray-600 mb-1">Informasi Kontak (WA/Line) <span className="text-red-500">*</span></label><input name="finderContact" type="text" id="kontak-penemu" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"/></div>
                        <div><label htmlFor="tanggal-ditemukan" className="block text-sm font-medium text-gray-600 mb-1">Tanggal Ditemukan <span className="text-red-500">*</span></label><input name="foundDate" type="date" id="tanggal-ditemukan" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"/></div>
                        <div><label htmlFor="lokasi-ditemukan" className="block text-sm font-medium text-gray-600 mb-1">Lokasi Ditemukan <span className="text-red-500">*</span></label><input name="location" type="text" id="lokasi-ditemukan" required className="w-full p-2 bg-gray-50 border rounded-md focus:ring-blue-500 focus:border-blue-500"/></div>
                        <div><label className="block text-sm font-medium text-gray-600 mb-1">Foto Penemu <span className="text-red-500">*</span></label><input type="file" required onChange={(e) => e.target.files && setFinderPhoto(e.target.files[0])} className="block w-full text-sm text-gray-700 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:bg-blue-50 file:text-blue-700 file:font-semibold file:border-none file:px-4 file:py-2 hover:file:bg-blue-100"/></div>
                    </div>
                </div>
                <div className="text-right"><button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400">{isLoading ? 'Menyimpan...' : 'Simpan Data Barang'}</button></div>
            </form>
        </div>
    );
};