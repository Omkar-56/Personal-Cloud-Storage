import { Upload, Filter, Search, ArrowDownUp } from "lucide-react";

export default function FileToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white shadow-sm rounded-xl p-4">
      <h2 className="text-lg font-semibold">All Files</h2>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Search bar */}
        <div className="flex items-center border rounded-lg px-3 py-1.5 bg-gray-50">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search files..."
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>

        {/* Filter button */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
          <Filter size={16} /> Filter
        </button>

        {/* Sort button */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
          <ArrowDownUp size={16} /> Sort
        </button>

        {/* Upload button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
          <Upload size={16} /> Upload
        </button>
      </div>
    </div>
  );
}
