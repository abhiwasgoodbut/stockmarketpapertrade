import { FiPlus, FiEdit } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const WatchlistHeader = () => {
  return (
    <div className="bg-blue-700 text-white px-4 py-2 flex items-center gap-3">
      <input
        type="text"
        placeholder="Search Script"
        className="flex-1 px-3 py-2 rounded bg-white text-black outline-none"
      />
        <NavLink to="/addscript">
      <button className="p-2 bg-blue-600 rounded">
        <FiPlus />
      </button>
      </NavLink>

      <NavLink to='/managelist'>
      <button className="p-2 bg-blue-600 rounded">
        <FiEdit />
      </button>
      </NavLink>

      <button className="px-3 py-2 bg-blue-600 rounded text-sm">
        + Add Fund
      </button>
    </div>
  );
};

export default WatchlistHeader;
