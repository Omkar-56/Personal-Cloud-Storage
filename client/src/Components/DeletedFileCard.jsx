import { RefreshCcw, XCircle } from "lucide-react";

export default function DeletedFileCard({ file, onRestore, onDelete }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400 uppercase">{file.type}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 truncate">{file.name}</h3>
      <p className="text-sm text-gray-500 mb-3">
        {file.size} • Deleted on {file.dateDeleted}
      </p>

      <div className="flex justify-between text-gray-500 mt-2">
        <button
          className="flex items-center gap-1 hover:text-green-600"
          onClick={() => onRestore(file.id)}
        >
          <RefreshCcw size={16} /> <span>Restore</span>
        </button>

        <button
          className="flex items-center gap-1 hover:text-red-600"
          onClick={() => onDelete(file.id)}
        >
          <XCircle size={16} /> <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
