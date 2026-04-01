import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUserProfile } from "../api/userApi";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getAllUsers(token)
      .then(setUsers)
      .catch((err) => console.error("Error:", err.message));
  }, [token]);

  // Pagination setup
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  const handleView = (id: number) => navigate(`/users/${id}/view`);
  const handleEdit = (id: number) => navigate(`/users/${id}/edit`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserProfile(id, token || "");
      alert("User deleted successfully!");
      setUsers(users.filter((u) => u.id !== id)); // remove from state
    } catch (err: any) {
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        All Users
      </h2>

      <table className="w-full border-collapse border border-gray-200 text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border border-gray-200 px-4 py-2">#</th>
            <th className="border border-gray-200 px-4 py-2">First Name</th>
            <th className="border border-gray-200 px-4 py-2">Last Name</th>
            <th className="border border-gray-200 px-4 py-2">Email</th>
            <th className="border border-gray-200 px-4 py-2">Phone</th>
            <th className="border border-gray-200 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u, index) => (
            <tr
              key={u.serId}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="border border-gray-200 px-4 py-2">
                {(currentPage - 1) * usersPerPage + index + 1}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {u.firstName}
              </td>
              <td className="border border-gray-200 px-4 py-2">{u.lastName}</td>
              <td className="border border-gray-200 px-4 py-2">{u.email}</td>
              <td className="border border-gray-200 px-4 py-2">{u.mobile}</td>
              <td className="border border-gray-200 px-4 py-2 space-x-2">
                <button
                  onClick={() => handleView(u.serId)}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(u.serId)}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.serId)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {currentUsers.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center text-gray-500 py-4 border border-gray-200"
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>

        <div className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages || 1}
        </div>

        <select
          value={usersPerPage}
          onChange={(e) => {
            setUsersPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>
    </div>
  );
}
