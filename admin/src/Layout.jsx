import { Outlet } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import { Toaster } from "react-hot-toast";
import AdminLogin from "../pages/AdminLogin";
import AdminSidebar from "../components/AdminSidebar";

const Layout = () => {
  const { adminToken } = useAdminContext();

  if (!adminToken) {
    return (
      <>
        <Toaster position="top-center" />
        <AdminLogin />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#060b17] text-white">
      <Toaster position="top-center" />

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;