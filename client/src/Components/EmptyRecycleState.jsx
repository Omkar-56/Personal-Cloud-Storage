export default function EmptyRecycleState() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2991/2991201.png"
        alt="Empty Recycle Bin"
        className="w-32 mb-4 opacity-80"
      />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Recycle Bin is Empty</h3>
      <p className="text-gray-500 max-w-md">
        You haven’t deleted any files yet. When you delete a file, it will appear here and
        stay for 30 days before being permanently removed.
      </p>
    </div>
  );
}
