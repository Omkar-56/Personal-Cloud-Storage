import { useState } from "react";
import { Trash2, RefreshCcw, XCircle } from "lucide-react";
import DeletedFileCard from "../components/DeletedFileCard";
import EmptyRecycleState from "../components/EmptyRecycleState";

export default function RecycleBinPage() {
  const [deletedFiles, setDeletedFiles] = useState([
    { id: 1, name: "Old_Project.zip", size: "25 MB", dateDeleted: "Oct 6, 2025", type: "zip" },
    { id: 2, name: "Invoice_2024.pdf", size: "1.2 MB", dateDeleted: "Oct 1, 2025", type: "pdf" },
    { id: 3, name: "Screenshot.png", size: "650 KB", dateDeleted: "Sep 29, 2025", type: "image" },
  ]);

  const handleRestore = (id) => {
    setDeletedFiles(deletedFiles.filter((file) => file.id !== id));
    alert("File restored successfully!");
  };

  const handleDeletePermanently = (id) => {
    setDeletedFiles(deletedFiles.filter((file) => file.id !== id));
    alert("File permanently deleted!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trash2 size={22} /> Recycle Bin
        </h2>
        <button className="text-sm text-gray-500 hover:text-red-500">
          Empty Recycle Bin
        </button>
      </div>

      {deletedFiles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deletedFiles.map((file) => (
            <DeletedFileCard
              key={file.id}
              file={file}
              onRestore={handleRestore}
              onDelete={handleDeletePermanently}
            />
          ))}
        </div>
      ) : (
        <EmptyRecycleState />
      )}
    </div>
  );
}
