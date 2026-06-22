import { Outlet } from "react-router-dom"
import Sidebar from "../router/Sidebar"
import NotificationCard from "../components/ui/NotificationCard"
import MobileOnlyError from "../components/errores/MobileOnlyError"

const MainPage = () => {
  return (
    <>
      <MobileOnlyError />
      <div className="flex h-screen bg-gray-100">
        <NotificationCard />
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}

export default MainPage