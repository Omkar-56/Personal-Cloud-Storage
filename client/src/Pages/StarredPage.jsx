import { useState } from "react";
import { ChevronDown } from "lucide-react";
import StarredFileCard from "../components/StarredFileCard";
import StarredEmptyState from "../components/StarredEmptyState";

export default function StarredPage() {
  const [files, setFiles] = useState([
    { id: 1, name: "Project_Report.pdf", size: "2.1 MB", date: "Oct 10, 2025", type: "pdf" },
    { id: 2, name: "Presentation.pptx", size: "3.5 MB", date: "Oct 8, 2025", type: "ppt" },
    { id: 3, name: "Vacation_Photo.jpg", size: "1.8 MB", date: "Oct 5, 2025", type: "image" },
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">⭐ Starred Files</h2>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            Sort by <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {files.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <StarredFileCard key={file.id} file={file} onUnstar={(id) => setFiles(files.filter(f => f.id !== id))} />
          ))}
        </div>
      ) : (
        <StarredEmptyState />
      )}
    </div>
  );
}
