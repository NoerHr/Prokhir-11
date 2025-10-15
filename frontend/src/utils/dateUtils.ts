/**
 * Format tanggal ke "2025-10-02 (07.00 WIB)"
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return "Tanggal tidak valid";
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} (${hours}.${minutes} WIB)`;
};

/**
 * Hitung durasi simpan: "12 hari 2 jam"
 */
export const calculateStorageDuration = (
  foundDate: string,
  claimedDate?: string | null
): string => {
  if (!foundDate) return "N/A";
  
  const startDate = new Date(foundDate);
  const endDate = claimedDate ? new Date(claimedDate) : new Date();
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return "Waktu tidak valid";
  }
  
  // Hitung selisih dalam milidetik
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
  
  // Konversi ke hari dan jam
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days === 0 && hours === 0) {
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes} menit`;
  }
  
  if (days === 0) {
    return `${hours} jam`;
  }
  
  if (hours === 0) {
    return `${days} hari`;
  }
  
  return `${days} hari ${hours} jam`;
};
