import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AllFiles from "./pages/AllFiles";
import SharedFileView from "./pages/SharedFileView";
import StarredPage from "./pages/StarredPage";
import RecycleBinPage from "./pages/RecycleBinPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />  {/* ✅ Now inside Router */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/files" element={<AllFiles />} />
            <Route path="/shared" element={<SharedFileView />} />
            <Route path="/starred" element={<StarredPage />} />
            <Route path="/recycle" element={<RecycleBinPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
