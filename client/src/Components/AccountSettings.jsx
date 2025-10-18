export default function AccountSettings() {
  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Account & Profile</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Username</label>
          <input type="text" className="mt-1 w-full border rounded-lg p-2" defaultValue="JohnDoe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input type="email" className="mt-1 w-full border rounded-lg p-2" defaultValue="john@example.com" />
        </div>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </section>
  );
}
