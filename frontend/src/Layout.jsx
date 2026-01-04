import Navbottom from "./components/Navbottom";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";

const Layout = () => {
  const { user, authLoading } = useAppContext();

  // 🔥 WAIT UNTIL AUTH CHECK FINISHES
  if (authLoading) return null;

  if (!user) {
    return (
      <>
        <Toaster position="top-center" />
        <Auth />
      </>
    );
  }

  if (!user.termsAccepted) {
    return (
      <>
        <Toaster position="top-center" />
        <Terms />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Navbottom />
      <Outlet />
    </>
  );
};

export default Layout;
