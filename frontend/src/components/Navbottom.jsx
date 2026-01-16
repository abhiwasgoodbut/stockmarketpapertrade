import React from 'react'
import { NavLink } from "react-router-dom";
import { FaBookmark, FaBriefcase, FaUserCog } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { MdTimer } from "react-icons/md";

const Navbottom = () => {
     const base = "flex flex-col items-center justify-center text-xs transition-colors";
  return (
    <div  className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t flex justify-around items-center">
      <NavLink to="/sl-tp" className={({ isActive }) =>
        `${base} ${isActive ? "text-blue-700" : "text-gray-500"}`
      }>
        <MdTimer className="text-xl mb-1" />
        SL/TP
      </NavLink>

      <NavLink to="/position" className={({ isActive }) =>
        `${base} ${isActive ? "text-blue-700" : "text-gray-500"}`
      }>
        <IoStatsChart className="text-xl mb-1" />
        Position
      </NavLink>

      {/* CENTER BUTTON */}

      <NavLink to="/" className={({ isActive }) =>
        `${base} ${isActive ? "text-blue-700" : "text-gray-500"}`
      }>
        <FaBookmark className="text-xl mb-1" />
        Watchlist
      </NavLink>

      <NavLink to="/trades" className={({ isActive }) =>
        `${base} ${isActive ? "text-blue-700" : "text-gray-500"}`
      }>
        <FaBriefcase className="text-xl mb-1" />
        Trades
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) =>
        `${base} ${isActive ? "text-blue-700" : "text-gray-500"}`
      }>
        <FaUserCog className="text-xl mb-1" />
        Profile
      </NavLink>
    </div>
  )
}

export default Navbottom