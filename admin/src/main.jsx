import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./Layout.jsx";
import { AdminContextProvider } from "../context/AdminContext.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminUser from "../pages/AdminUser.jsx";
import AdminDeposit from "../pages/AdminDeposit.jsx";
import AdminWithdraw from "../pages/AdminWithdraw.jsx";
import AdminTrade from "../pages/AdminTrade.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='' element={<AdminDashboard/>}/>
      <Route path='users' element={<AdminUser/>}/>
      <Route path='deposit' element={<AdminDeposit/>}/>
      <Route path='withdraw' element={<AdminWithdraw/>}/>
      <Route path='trades' element={<AdminTrade/>}/>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminContextProvider>
      <RouterProvider router={router} />
    </AdminContextProvider>
  </StrictMode>
);