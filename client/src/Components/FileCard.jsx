import { FileText, Image, Video, Star } from "lucide-react";

export default function FileCard({ file }) {
  const getIcon = (type) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText className="text-red-500" size={28} />;
      case "image":
        return <Image className="text-green-500" size={28} />;
      case "video":
        return <Video className="text-purple-500" size={28} />;
      default:
        return <FileText className="text-gray-500" size={28} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 transition-all">
      <div className="flex justify-between items-start">
        {getIcon(file.type)}
        <Star size={18} className="text-gray-400 hover:text-yellow-500 cursor-pointer" />
      </div>
      <div className="mt-3">
        <h3 className="font-medium text-sm truncate">{file.name}</h3>
        <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
      </div>
    </div>
  );
}
