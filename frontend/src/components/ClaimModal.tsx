import React, { useState } from "react";
import { Item, Claimer } from "../types";
import { toast } from "react-hot-toast";

interface ClaimModalProps {
  item: Item;
  onClose: () => void;
  onClaim: (
    itemId: number,
    claimerPhoto: File,
    claimerData: Omit<Claimer, "photoUrl" | "claimedDate">
  ) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  item,
  onClose,
  onClaim,
}) => {
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [claimerPhoto, setClaimerPhoto] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!name || !nim || !claimerPhoto) {
      toast.error("Harap isi semua kolom dan unggah foto penerima.");
      return;
    }
    onClaim(item.id, claimerPhoto, { name, nim });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Form Pengambilan Barang</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Nama Penerima <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              NIM Penerima <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Foto Penerima <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              required
              onChange={(e) =>
                e.target.files && setClaimerPhoto(e.target.files[0])
              }
              className="block w-full text-sm text-gray-700 border border-gray-200 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:bg-blue-50 file:text-blue-700 file:font-semibold file:border-none file:px-4 file:py-2 hover:file:bg-blue-100"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Konfirmasi Pengambilan
          </button>
        </div>
      </div>
    </div>
  );
};
