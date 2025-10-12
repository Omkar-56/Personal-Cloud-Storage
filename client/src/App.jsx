import Home from './Pages/Home'
import Sidebar from "./components/Sidebar";

function App() {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
        <Home />
    </div>
  )
}

export default App
