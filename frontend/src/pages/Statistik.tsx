import React, { useMemo } from "react";
import { Item } from "../types";

interface StatistikProps {
  items: Item[];
}

export const Statistik: React.FC<StatistikProps> = ({ items }) => {
  const stats = useMemo(() => {
    const claimedItems = items.filter(
      (i) => i.claimer && i.foundDate && i.claimer.claimedDate
    );
    let totalStorageDays = 0;
    if (claimedItems.length > 0) {
      totalStorageDays = claimedItems.reduce((acc, item) => {
        const foundDate = new Date(item.foundDate);
        const claimedDate = new Date(item.claimer!.claimedDate);
        const diffTime = Math.abs(claimedDate.getTime() - foundDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
      }, 0);
    }
    const avgStorage =
      claimedItems.length > 0
        ? (totalStorageDays / claimedItems.length).toFixed(1)
        : "0";
    const monthlyData = items.reduce((acc, item) => {
      try {
        const month = new Date(item.foundDate).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + 1;
      } catch (e) {
        // Skip invalid dates and continue with accumulator
        console.log(e);
        return acc;
      }
      return acc;
    }, {} as Record<string, number>);
    const chartLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const chartData = chartLabels.map((label) => ({
      name: label,
      found: monthlyData[label] || 0,
    }));
    return {
      claimedCount: items.filter((i) => i.status === "Diambil").length,
      avgStorage,
      chartData,
      totalItems: items.length,
    };
  }, [items]);

  const maxVal = Math.max(...stats.chartData.map((d) => d.found), 1);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Statistik</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-lg">Total Barang Ditemukan</h3>
          <p className="text-4xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-lg">Total Barang Diambil</h3>
          <p className="text-4xl font-bold">{stats.claimedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-lg">Rata-rata Waktu Simpan</h3>
          <p className="text-4xl font-bold">
            {stats.avgStorage}{" "}
            <span className="text-2xl text-gray-400">hari</span>
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Barang Ditemukan per Bulan
        </h3>
        <div className="h-80 flex items-end justify-around pt-4">
          {stats.chartData.map((data) => (
            <div
              key={data.name}
              className="flex flex-col items-center h-full justify-end"
              style={{ width: "6%" }}
            >
              <div
                className="w-full bg-blue-400 rounded-t-md hover:bg-blue-500 transition-colors"
                style={{ height: `${(data.found / maxVal) * 100}%` }}
                title={`Ditemukan: ${data.found}`}
              ></div>
              <span className="text-sm text-gray-500 mt-2">{data.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
