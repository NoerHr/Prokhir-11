import React, { useMemo } from 'react';
import { Item } from '../types';

interface BerandaProps {
    items: Item[];
}

export const Beranda: React.FC<BerandaProps> = ({ items }) => {
    const summaryData = useMemo(() => {
        const foundItems = items.filter(item => item.status === 'Ditemukan').length;
        const claimedItems = items.filter(item => item.status === 'Diambil').length;
        const allNims = new Set([...items.map(i => i.finder.nim).filter(Boolean),...items.filter(i => i.claimer).map(i => i.claimer!.nim).filter(Boolean)]);
        return { ditemukan: foundItems, diambil: claimedItems, pengguna: allNims.size };
    }, [items]);

    const foundItemsList = useMemo(() => {
        return items.filter(item => item.status === 'Ditemukan').sort((a, b) => new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime());
    }, [items]);

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Ringkasan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-gray-500 text-lg">Barang Ditemukan</h3><p className="text-4xl font-bold text-gray-800">{summaryData.ditemukan}</p></div>
                <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-gray-500 text-lg">Barang Diambil</h3><p className="text-4xl font-bold text-gray-800">{summaryData.diambil}</p></div>
                <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-gray-500 text-lg">Pengguna Terdaftar</h3><p className="text-4xl font-bold text-gray-800">{summaryData.pengguna}</p></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Barang Ditemukan</h2>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr><th className="p-4 text-gray-600 font-semibold">Nama Barang</th><th className="p-4 text-gray-600 font-semibold">Deskripsi</th><th className="p-4 text-gray-600 font-semibold">Tanggal Ditemukan</th><th className="p-4 text-gray-600 font-semibold">Status</th></tr>
                    </thead>
                    <tbody>
                        {foundItemsList.length > 0 ? foundItemsList.map((item, index) => (
                            <tr key={item.id} className={index !== foundItemsList.length - 1 ? "border-b border-gray-200" : ""}>
                                <td className="p-4 text-gray-700 font-medium">{item.name}</td><td className="p-4 text-gray-600">{item.description}</td><td className="p-4 text-gray-600">{item.foundDate}</td>
                                <td className="p-4"><span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700`}>{item.status}</span></td>
                            </tr>
                        )) : ( <tr><td colSpan={4} className="text-center p-8 text-gray-500">Tidak ada barang yang berstatus ditemukan.</td></tr> )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};