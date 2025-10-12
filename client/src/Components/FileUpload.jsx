import React, { useState } from "react";
import { UploadCloud, File } from "lucide-react";

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    // later connect this to backend API
    console.log("Uploading files:", files);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 border mx-6">
      <h2 className="text-lg font-semibold mb-4">Upload Files</h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
      >
        <UploadCloud size={48} className="text-blue-500 mb-3" />
        <p className="text-gray-700 font-medium">Drag & drop files here</p>
        <p className="text-sm text-gray-500">or click to select files</p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
        >
          Choose Files
        </label>
      </div>

      {/* Show selected files */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded-md text-sm text-gray-700"
              >
                <File size={16} className="text-gray-500" />
                {file.name}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpload}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
