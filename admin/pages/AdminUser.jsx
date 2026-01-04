import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminContext } from "../context/AdminContext";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AdminUser = () => {
  const { adminToken } = useAdminContext();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editUser, setEditUser] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: adminToken }
      });

      if (data.success) {
        setUsers(data.users);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FILTER ================= */
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        String(u.number).includes(q)
    );
  }, [users, search]);

  const totalBalance = useMemo(
    () => users.reduce((sum, u) => sum + (u.balance || 0), 0),
    [users]
  );

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    try {
      const { data } = await axios.put(
        `/api/admin/users/${editUser._id}`,
        editUser,
        { headers: { Authorization: adminToken } }
      );

      if (data.success) {
        toast.success("User updated");
        setEditUser(null);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name / username / number"
          className="bg-black/30 border border-white/10 px-4 py-2 rounded text-sm w-72"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Total Users" value={users.length} />
        <Stat title="Total Balance" value={`₹ ${totalBalance.toFixed(2)}`} />
        <Stat title="Showing" value={filteredUsers.length} />
      </div>

      {/* TABLE */}
      <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <Th>Name</Th>
              <Th>Username</Th>
              <Th>Number</Th>
              <Th>Password</Th>
              <Th className="text-right">Balance</Th>
              <Th className="text-center">Action</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filteredUsers.map(user => (
              <tr
                key={user._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <Td>{user.name}</Td>
                <Td>{user.username}</Td>
                <Td>{user.number}</Td>
                <Td>{user.password}</Td>
                <Td className="text-right">₹ {user.balance}</Td>
                <Td className="text-center">
                  <button
                    onClick={() => setEditUser({ ...user })}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500"
                  >
                    Edit
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0b1220] w-full max-w-lg rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>

            <div className="space-y-4">
              <Field
                label="Full Name"
                value={editUser.name}
                onChange={(v) => setEditUser({ ...editUser, name: v })}
              />
              <Field
                label="Username"
                value={editUser.username}
                onChange={(v) => setEditUser({ ...editUser, username: v })}
              />
              <Field
                label="Mobile Number"
                value={editUser.number}
                onChange={(v) => setEditUser({ ...editUser, number: v })}
              />
              <Field
                label="Password"
                value={editUser.password}
                onChange={(v) => setEditUser({ ...editUser, password: v })}
              />
              <Field
                label="Balance (₹)"
                value={editUser.balance}
                onChange={(v) => setEditUser({ ...editUser, balance: v })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUser;

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ title, value }) => (
  <div className="bg-black/30 border border-white/10 rounded-xl p-4">
    <p className="text-xs text-gray-400">{title}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left font-medium ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 ${className}`}>
    {children}
  </td>
);

const Field = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/30 border border-white/10 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
    />
  </div>
);