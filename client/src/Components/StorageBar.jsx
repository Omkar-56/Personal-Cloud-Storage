// src/components/StorageBar.jsx
const StorageBar = ({ usageData, total }) => {
  const totalUsed = usageData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="bg-white shadow-sm border rounded-2xl p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Flow Forge Space’s</h3>
        <p className="text-sm text-gray-600">
          Using <span className="font-bold">{totalUsed} GB</span> of {total} GB
        </p>
      </div>

      {/* Color Bar */}
      <div className="flex h-3 w-full rounded-full overflow-hidden mb-2">
        {usageData.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color}`}
            style={{
              width: `${(item.amount / total) * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        {usageData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
            {item.label} ({item.amount} GB)
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        When your team runs out of space, syncing stops. To add more,{" "}
        <span className="text-blue-600 cursor-pointer">contact support</span>.
      </p>
    </div>
  );
};

export default StorageBar;
