import { Outlet } from "react-router-dom"
import Sidebar from "../router/Sidebar"
import NotificationCard from "../components/ui/NotificationCard"

const MainPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <NotificationCard />
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainPage