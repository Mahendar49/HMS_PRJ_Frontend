import React, { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";

import UsersList from "./UsersList";

interface User {
  username: string;
  email: string;
  role: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const navigate = useNavigate();

  // const dummyData: User[] = [
  //   { username: "Jaya", email: "jaya@gmail.com", role: "user" },
  //   { username: "Ravi", email: "ravi@gmail.com", role: "admin" },
  // ];
  //   const [users, setUsers] = useState<User[]>([
  //   { username: "Jaya", email: "jaya@gmail.com", role: "user" },
  //   { username: "John", email: "John@gmail.com", role: "admin" },
  // ]);
  const [users, setUsers] = useState<User[]>([
    { username: "Jaya", email: "jaya@gmail.com", role: "user" },
    { username: "Ravi", email: "ravi@gmail.com", role: "admin" },
    { username: "Rani", email: "rani@gmail.com", role: "nurse" },
    { username: "Sunil", email: "sunil@gmail.com", role: "doctor" },
    { username: "Harsha", email: "harsha@gmail.com", role: "user" },
    { username: "Pooja", email: "pooja@gmail.com", role: "nurse" },
    { username: "Kiran", email: "kiran@gmail.com", role: "admin" },
    { username: "Sneha", email: "sneha@gmail.com", role: "user" },
    { username: "Vijay", email: "vijay@gmail.com", role: "doctor" },
    { username: "Arun", email: "arun@gmail.com", role: "user" },
    // Add more users later — search will still work ✅
  ]);

  // Top 10 users shown in dropdown
  const topUsers = users.slice(0, 10);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const match = users.find(
      (u) => u.username.toLowerCase() === term.toLowerCase()
    );
    if (match) {
      setFoundUser(match);
      setShowModal(false);
      setShowCreateButton(false);
      setIsEditing(false);
    } else {
      setFoundUser(null);
      setShowModal(true);
    }
  };

  const handleDelete = () => {
    if (!foundUser) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(
        users.filter((u) => {
          console.log(u);
          return u.username !== foundUser.username;
        })
      );
      setFoundUser(null); // remove table view
      alert("User deleted successfully!");
    }
  };

  // const handleSearch = (term: string) => {
  //   setSearchTerm(term);
  //   const match = dummyData.find(
  //     (u) => u.username.toLowerCase() === term.toLowerCase()
  //   );
  //   if (match) {
  //     setFoundUser(match);
  //     setShowModal(false);
  //     setShowCreateButton(false);
  //     setIsEditing(false);
  //   } else {
  //     setFoundUser(null);
  //     setShowModal(true);
  //   }
  // };

  const handleEdit = () => {
    if (foundUser) {
      setEditedUser({ ...foundUser });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editedUser) {
      setFoundUser(editedUser);
      setIsEditing(false);
      alert("User updated successfully!");
    }
  };

  const handleBack = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "calc(100vh - 100px)", // leaves room for navbar if any
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: "700px",
          backgroundColor: "white",
          borderRadius: "12px",
        }}
      >
        <h3 className="text-center text-primary fw-bold mb-4">Users</h3>

        {/* Auto Suggest Search */}
        <div className="position-relative mb-3" style={{ width: "100%" }}>
          <label className="form-label fw-semibold">Search User</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowModal(false)} // close modal if open
          />

          {/* Dropdown Suggestions */}
          {(searchTerm === "" || searchTerm.length >= 1) && (
            <ul
              className="list-group position-absolute w-100"
              style={{
                zIndex: 10,
                maxHeight: "180px",
                overflowY: "auto",
                cursor: "pointer",
              }}
            >
              {/* Show Top 10 if search empty */}
              {/* {searchTerm === "" &&
        users.slice(0, 10).map((u, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action"
            onClick={() => {
              setSearchTerm(u.username);
              handleSearch(u.username);
            }}
          >
            {u.username}
          </li>
        ))} */}

              {/* Show filtered results when typing */}
              {searchTerm !== "" &&
                users
                  .filter((u) =>
                    u.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((u, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSearchTerm(u.username);
                        handleSearch(u.username);
                      }}
                    >
                      {u.username}
                    </li>
                  ))}

              {/* No Match Case */}
              {searchTerm !== "" &&
                users.filter((u) =>
                  u.username.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <li className="list-group-item text-muted">No users found</li>
                )}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <div className="text-end mb-3">
          <button
            className="btn btn-primary"
            onClick={() => handleSearch(searchTerm)}
          >
            Search
          </button>
        </div>

        {/* Search bar */}
        {/* <SearchBar onSearch={handleSearch} /> */}

        {/* Dropdown to select a user */}
        {/* <div className="mb-3">
  <label className="form-label fw-semibold">Select User</label>
  <select
    className="form-select"
    onChange={(e) => handleSearch(e.target.value)}
    defaultValue=""
  >
    <option value="" disabled>Select a user...</option>
    {users.map((u, index) => (
      <option key={index} value={u.username}>
        {u.username}
      </option>
    ))}
  </select>
</div> */}

        {/* Search bar (still available) */}
        {/* <SearchBar onSearch={handleSearch} /> */}

        {/* Back & Create User Buttons */}
        {showCreateButton && (
          <div className="d-flex justify-content-end mb-3 gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              className="btn btn-success"
              onClick={() => navigate("/admin/create-user")}
            >
              Create User
            </button>
          </div>
        )}

        {/* If user is found and NOT editing → show table */}
        {foundUser && !isEditing && (
          <>
            <table className="table table-bordered mt-3 mb-4">
              <thead className="table-light">
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{foundUser.username}</td>
                  <td>{foundUser.email}</td>
                  <td>{foundUser.role}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2">View</button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
            </div>
            {<UsersList />}
          </>
        )}

        {/* If editing → show edit form */}
        {isEditing && editedUser && (
          <div className="mt-4">
            <h5 className="text-center mb-3 text-primary">Edit User</h5>

            <div className="mb-3">
              <label className="form-label fw-semibold">User Name</label>
              <input
                type="text"
                className="form-control"
                value={editedUser.username}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, username: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
              />
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        )}

        {/* Modal when user not found */}
        {/* <Modal
          show={showModal}
          message="User is not there. Click on Create User!"
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            setShowCreateButton(true);
          }}
        /> */}
      </div>
    </div>
  );
};

export default Users;
