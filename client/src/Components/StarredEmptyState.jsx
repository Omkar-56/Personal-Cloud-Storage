export default function StarredEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center mt-16 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
        alt="No Starred Files"
        className="w-32 mb-4 opacity-80"
      />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Starred Files Yet</h3>
      <p className="text-gray-500 max-w-md">
        You haven’t starred any files yet. Click the ⭐ icon on a file to mark it as important and find it here quickly.
      </p>
    </div>
  );
}
