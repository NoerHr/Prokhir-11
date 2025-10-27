import React, { useMemo } from "react";
import { Item } from "../types";
import { formatDateTime } from "../utils/dateUtils";
import { motion } from "framer-motion";

interface BerandaProps {
  items: Item[];
}

export const Beranda: React.FC<BerandaProps> = ({ items }) => {
  const summaryData = useMemo(() => {
    const foundItems = items.filter((item) => item.status === "DITEMUKAN").length;
    const claimedItems = items.filter((item) => item.status === "DIAMBIL").length;
    return { ditemukan: foundItems, diambil: claimedItems };
  }, [items]);

  const foundItemsList = useMemo(() => {
    return items
      .filter((item) => item.status === "DITEMUKAN")
      .sort((a, b) => new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime());
  }, [items]);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-800 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
      >
        Dashboard Overview
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 backdrop-blur-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-lg">Barang Ditemukan</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {summaryData.ditemukan}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 backdrop-blur-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h3 className="text-gray-500 text-lg">Barang Diambil</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                {summaryData.diambil}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Barang Ditemukan Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-gray-600 font-semibold text-left">Nama Barang</th>
                <th className="px-6 py-4 text-gray-600 font-semibold text-left">Deskripsi</th>
                <th className="px-6 py-4 text-gray-600 font-semibold text-left">Tanggal Ditemukan</th>
                <th className="px-6 py-4 text-gray-600 font-semibold text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {foundItemsList.length > 0 ? (
                foundItemsList.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">{item.description}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDateTime(item.foundDate)}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {item.status.toLowerCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">
                    Tidak ada barang yang berstatus ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
