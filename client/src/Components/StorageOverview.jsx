// src/components/StorageOverview.jsx
import StorageCard from "./StorageCard";
import StorageBar from "./StorageBar";

const StorageOverview = () => {
  const cards = [
    { type: "Documents", amount: 120, change: 24, dateRange: "Jan 01, 2025 – Dec 30, 2025" },
    { type: "Images", amount: 85, change: -12, dateRange: "Jan 01, 2025 – Dec 30, 2025" },
    { type: "Videos", amount: 200, change: 8, dateRange: "Jan 01, 2025 – Dec 30, 2025" },
    { type: "Others", amount: 50, change: 24, dateRange: "Jan 01, 2025 – Dec 30, 2025" },
  ];

  const usageData = [
    { label: "Regular files", amount: 60, color: "bg-blue-500" },
    { label: "Replay", amount: 24, color: "bg-yellow-400" },
    { label: "Shared files", amount: 16, color: "bg-red-500" },
    { label: "Unused space", amount: 12, color: "bg-gray-200" },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <StorageCard key={idx} {...card} />
        ))}
      </div>

      <StorageBar usageData={usageData} total={112} />
    </div>
  );
};

export default StorageOverview;
