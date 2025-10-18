// src/pages/SharedFileView.jsx
import FilePreviewCard from "../components/FilePreviewCard";

export default function SharedFileView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📁 Secure File Sharing
      </h1>

      <FilePreviewCard />

      <footer className="mt-10 text-gray-400 text-sm">
        Powered by{" "}
        <span className="text-blue-600 font-semibold">In.Secure</span>
      </footer>
    </div>
  );
}
