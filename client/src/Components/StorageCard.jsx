// src/components/StorageCard.jsx
import { FileText, Image, Video, Folder } from "lucide-react";

const icons = {
  documents: <FileText className="text-blue-500" />,
  images: <Image className="text-green-500" />,
  videos: <Video className="text-purple-500" />,
  others: <Folder className="text-yellow-500" />,
};

const StorageCard = ({ type, amount, change, dateRange }) => {
  return (
    <div className="bg-white shadow-sm border rounded-2xl p-4 flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {icons[type.toLowerCase()]}
          <h3 className="font-semibold capitalize">{type}</h3>
        </div>
        <span
          className={`text-sm font-medium ${
            change >= 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {change >= 0 ? `+${change}%` : `${change}%`}
        </span>
      </div>

      <h2 className="text-2xl font-bold">{amount} GB</h2>

      <p className="text-xs text-gray-500">{dateRange}</p>
    </div>
  );
};

export default StorageCard;
