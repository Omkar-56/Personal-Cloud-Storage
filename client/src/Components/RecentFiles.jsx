import React from "react";
import { FileText, Image, Video, Music, MoreHorizontal } from "lucide-react";

const getFileIcon = (type) => {
  switch (type) {
    case "document":
      return <FileText className="text-blue-500" />;
    case "image":
      return <Image className="text-green-500" />;
    case "video":
      return <Video className="text-purple-500" />;
    case "audio":
      return <Music className="text-orange-500" />;
    default:
      return <FileText className="text-gray-400" />;
  }
};

const RecentFiles = ({ files = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border mx-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recently Accessed</h2>
        <button className="text-blue-600 text-sm hover:underline">
          See all
        </button>
      </div>

      {files.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent files found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-md shadow-sm">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last opened: {file.lastAccessed}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentFiles;
