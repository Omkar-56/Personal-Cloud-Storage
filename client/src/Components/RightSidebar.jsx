import { FileText, Video, Music, Image } from "lucide-react";

export default function RightSidebar() {
  return (
    <aside className="w-72 bg-white shadow-lg p-6 flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <img src="https://via.placeholder.com/40" alt="profile" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">Kurnia Majid</p>
          <p className="text-xs text-gray-500">User</p>
        </div>
      </div>

      {/* Storage Usage */}
      <h3 className="text-sm font-semibold mb-2">Storage</h3>
      <div className="bg-gray-100 h-2 rounded-full mb-2">
        <div className="bg-blue-500 h-2 rounded-full w-[60%]"></div>
      </div>
      <p className="text-xs text-gray-500 mb-6">12GB used of 20GB</p>

      {/* File Types */}
      <h3 className="text-sm font-semibold mb-4">File Types</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <FileText size={16} className="text-blue-500" />
            <span>Documents</span>
          </div>
          <span className="text-gray-500">16 GB</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <Video size={16} className="text-red-500" />
            <span>Videos</span>
          </div>
          <span className="text-gray-500">12 GB</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <Music size={16} className="text-green-500" />
            <span>Audio</span>
          </div>
          <span className="text-gray-500">6 GB</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <Image size={16} className="text-purple-500" />
            <span>Images</span>
          </div>
          <span className="text-gray-500">8 GB</span>
        </div>
      </div>
    </aside>
  );
}
