import AccountSettings from "../components/AccountSettings";
// import StorageSettings from "./StorageSettings";
// import SecuritySettings from "./SecuritySettings";
// import AISettings from "./AISettings";
// import AppearanceSettings from "./AppearanceSettings";
// import AccountActions from "./AccountActions";

export default function SettingsPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Settings</h2>

      <div className="space-y-8">
        <AccountSettings />
        {/* <StorageSettings />
        <SecuritySettings />
        <AISettings />
        <AppearanceSettings />
        <AccountActions /> */}
      </div>
    </div>
  );
}
