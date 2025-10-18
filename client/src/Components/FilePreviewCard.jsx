// src/components/FilePreviewCard.jsx
import { FileText, Download, Link2 } from "lucide-react";

export default function FilePreviewCard() {
  const file = {
    filename: "Project_Report_Q4.pdf",
    type: "PDF Document",
    size: "2.4 MB",
    uploadedBy: "Omkar Pansare",
    date: "12 Oct 2025",
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
          <FileText size={36} />
        </div>

        <h2 className="text-lg font-semibold mb-1">{file.filename}</h2>
        <p className="text-sm text-gray-500 mb-2">{file.type}</p>
        <p className="text-xs text-gray-400 mb-4">
          Size: {file.size} • Uploaded by {file.uploadedBy}
        </p>

        <a
          href="#"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Download size={18} /> Download File
        </a>

        <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
          <Link2 size={14} />
          <span>Shared on {file.date}</span>
        </div>
      </div>
    </div>
  );
}
