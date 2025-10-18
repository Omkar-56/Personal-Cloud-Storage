import { Star, Download, Share2, Eye } from "lucide-react";

export default function StarredFileCard({ file, onUnstar }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{file.type.toUpperCase()}</span>
        <button onClick={() => onUnstar(file.id)} className="text-yellow-500 hover:text-gray-400">
          <Star size={20} fill="currentColor" />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 truncate">{file.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{file.size} • {file.date}</p>

      <div className="flex justify-between text-gray-500 mt-2">
        <button className="hover:text-blue-600"><Eye size={18} /></button>
        <button className="hover:text-green-600"><Download size={18} /></button>
        <button className="hover:text-purple-600"><Share2 size={18} /></button>
      </div>
    </div>
  );
}
