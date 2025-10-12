import StorageOverview from "../Components/StorageOverview";
import FileUpload from "../Components/FileUpload";
import RecentFiles from "../Components/RecentFiles";

export default function Home() {
  const recentFiles = [
    {
      name: "Project_Brief.docx",
      type: "document",
      lastAccessed: "10 min ago",
    },
    {
      name: "Team.xls",
      type: "document",
      lastAccessed: "30 min ago",
    },
    {
      name: "New_Shot.png",
      type: "image",
      lastAccessed: "1 hour ago",
    },
  ];
  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
      <StorageOverview />
        <FileUpload />
        <RecentFiles files={recentFiles} />
    </main>
  );
}
