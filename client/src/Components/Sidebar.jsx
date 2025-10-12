import { Folder, Share2, Star, Trash2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-6">In.Secure</h2>
      <nav className="space-y-4">
        <button className="flex items-center space-x-3 text-blue-600 font-medium">
          <Folder size={18} /> <span>Home</span>
        </button>
        <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
          <Folder size={18} /> <span>All Files</span>
        </button>
        <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
          <Share2 size={18} /> <span>Shared Files</span>
        </button>
        <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
          <Star size={18} /> <span>Starred</span>
        </button>
        <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
          <Trash2 size={18} /> <span>Recycle Bin</span>
        </button>
        <button className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
          <Settings size={18} /> <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
}
