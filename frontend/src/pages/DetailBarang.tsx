import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Item, Claimer } from "../types";
import { TrashIcon } from "../components/Icons.tsx";
import { ClaimModal } from "../components/ClaimModal.tsx";
import { ConfirmModal } from "../components/ConfirmModal";
import { formatDateTime, calculateStorageDuration } from "../utils/dateUtils";

interface DetailBarangProps {
  item: Item | null;
  onClaim: (
    itemId: number,
    claimerPhoto: File,
    claimerData: Omit<Claimer, "photoUrl" | "claimedDate">
  ) => void;
  onDelete: (itemId: number) => void;
}

export const DetailBarang: React.FC<DetailBarangProps> = ({
  item,
  onClaim,
  onDelete,
}) => {
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  if (!item) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Barang tidak ditemukan</h1>
        <button
          onClick={() => navigate("/admin/daftar-barang")}
          className="text-blue-600 hover:underline mt-4"
        >
          Kembali ke Daftar Barang
        </button>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(item.id);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/admin/daftar-barang")}
          >
            Daftar Barang
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Detail</span>
        </div>
        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-2 border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          <TrashIcon /> Hapus Barang
        </button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="w-full h-80 bg-gray-200 rounded-xl shadow-lg overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">
                  {item.kategoriBarang.name}
                </p>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {item.name}
                </h1>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  item.status === "DITEMUKAN"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {item.status.toLowerCase()}
              </span>
            </div>
            <div className="border-t border-gray-200 my-6"></div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Tanggal Ditemukan</p>
                <p className="font-semibold">
                  {formatDateTime(item.foundDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Lokasi Ditemukan</p>
                <p className="font-semibold">{item.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold capitalize">
                  {item.status.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Lama Tersimpan</p>
                <p className="font-semibold">
                  {calculateStorageDuration(
                    item.foundDate,
                    item.claimer?.claimedDate
                  )}
                </p>
              </div>
            </div>
            {item.status === "DITEMUKAN" && (
              <div className="text-right mt-6">
                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700"
                >
                  Tandai Sudah Diambil
                </button>
              </div>
            )}

            {item.status === "Diambil" && (
              <div className="text-right mt-6">
                <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  ✓ Barang sudah diambil
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Informasi Penemu
          </h3>
          <div className="flex items-center gap-4">
            <img
              src={item.finder.photoUrl}
              alt={item.finder.name}
              className="w-20 h-20 rounded-full object-cover bg-gray-200"
            />
            <div>
              <p className="font-bold">{item.finder.name}</p>
              <p className="text-sm text-gray-600">NIM: {item.finder.nim}</p>
              <p className="text-sm text-gray-600">
                Kontak: {item.finder.contact}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Informasi Penerima
          </h3>
          {item.claimer ? (
            <div className="flex items-center gap-4">
              <img
                src={item.claimer.photoUrl}
                alt={item.claimer.name}
                className="w-20 h-20 rounded-full object-cover bg-gray-200"
              />
              <div>
                <p className="font-bold">{item.claimer.name}</p>
                <p className="text-sm text-gray-600">NIM: {item.claimer.nim}</p>
                <p className="text-sm text-gray-600">
                  Tanggal Diambil: {formatDateTime(item.claimer.claimedDate)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Barang belum diambil.</p>
          )}
        </div>
      </div>
      {isClaimModalOpen && (
        <ClaimModal
          item={item}
          onClose={() => setClaimModalOpen(false)}
          onClaim={onClaim}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Hapus Barang?"
        message="Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat diurungkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        type="danger"
      />
    </div>
  );
};
