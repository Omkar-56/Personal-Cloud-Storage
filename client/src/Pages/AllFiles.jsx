import FileToolbar from "../components/FileToolbar";
import FileGrid from "../components/FileGrid";
import { useState } from "react";

export default function AllFiles() {
  // Temporary mock data
  const [files, setFiles] = useState([
    { id: 1, name: "ProjectReport.pdf", type: "pdf", size: "1.2 MB", date: "2025-10-12" },
    { id: 2, name: "ProfilePic.png", type: "image", size: "500 KB", date: "2025-10-10" },
    { id: 3, name: "MeetingRecording.mp4", type: "video", size: "25 MB", date: "2025-10-05" },
  ]);

  return (
    <div className="space-y-6">
      <FileToolbar />
      <FileGrid files={files} />
    </div>
  );
}
