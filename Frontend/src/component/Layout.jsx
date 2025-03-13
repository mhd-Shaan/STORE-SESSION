import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import Navbar from "../component/Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="p-6 overflow-auto flex-1 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;