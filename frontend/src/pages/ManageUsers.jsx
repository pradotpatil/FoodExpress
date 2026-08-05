import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Load users error:", error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, newRole, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, role: newRole }
            : user
        )
      );

      alert("User role updated successfully!");
    } catch (error) {
      console.error("Role update failed:", error);
      alert("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (currentUser?.id === userId) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== userId
        )
      );

      alert("User deleted successfully!");
    } catch (error) {
      console.error("Delete user failed:", error);
      alert("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <main className="manage-users-page">
      <div className="manage-users-heading">
        <span>Admin Panel</span>

        <h1>Manage Users</h1>

        <p>View and manage registered users.</p>
      </div>

      <div className="users-card">
        <div className="users-top">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button
            type="button"
            onClick={loadUsers}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <h3>Loading...</h3>
        ) : filteredUsers.length === 0 ? (
          <h3>No users found.</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <select
                      value={user.role || "USER"}
                      onChange={(event) =>
                        handleRoleChange(
                          user.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td>
                    {user.enabled === false
                      ? "Blocked"
                      : "Active"}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="delete-user-button"
                      onClick={() =>
                        handleDeleteUser(user.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

export default ManageUsers;