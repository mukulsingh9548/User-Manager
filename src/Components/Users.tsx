import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Define a type for the user Information
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    username: "",
    email: "",
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string>("");

  // Get All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching users");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
  };

  // Delete the user
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);

      setUsers(users.filter((user) => user.id !== id));

      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const validateForm = (user: User): string => {
    if (!user.name || user.name.length < 3) {
      return "Name is required and should be at least 3 characters";
    }
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      return "A valid email is required";
    }
    if (!user.username || user.username.length < 3) {
      return "Username is required and should be at least 3 characters";
    }
    return "";
  };

  const createUser = async () => {
    const error = validateForm(newUser as User);
    if (error) {
      setFormError(error);
      return;
    }

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        newUser
      );

      setUsers([...users, response.data]);
      setNewUser({ name: "", username: "", email: "" });
      setShowCreateModal(false);
      setFormError("");
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setNewUser({ name: "", username: "", email: "" });
    setShowCreateModal(true);
  };

  // Update user request
  const updateUser = async () => {
    if (editUser) {
      const error = validateForm(editUser);
      if (error) {
        setFormError(error);
        return;
      }

      try {
        await axios.put(
          `https://jsonplaceholder.typicode.com/users/${editUser.id}`,
          editUser
        );

        setUsers(
          users.map((user) => (user.id === editUser.id ? editUser : user))
        );
        setShowEditModal(false);
        setEditUser(null);
        setFormError("");
      } catch (error) {
        console.error("Error updating user", error);
      }
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openCreateModal}
      >
        Create User
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="py-2 px-4 text-left text-white">ID</th>
              <th className="py-2 px-4 text-left text-white">Name</th>
              <th className="py-2 px-4 text-left text-white">Username</th>
              <th className="py-2 px-4 text-left text-white">Email</th>
              <th className="py-2 px-4 text-center text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-700" : "bg-[#00a67d]"}
              >
                <td className="py-2 px-4 border-b border-gray-600 text-white">
                  {user.id}
                </td>
                <td className="py-2 px-4 border-b border-gray-600 text-white">
                  {user.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-600 text-white">
                  {user.username}
                </td>
                <td className="py-2 px-4 border-b border-gray-600 text-white">
                  {user.email}
                </td>
                <td className="py-2 px-4 border-b border-gray-600 text-center">
                  <Link
                    to={`/user/${user.id}`}
                    className="text-blue-300 hover:underline mr-4"
                  >
                    View
                  </Link>
                  <button
                    className="text-yellow-300 hover:underline mr-4"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-300 hover:underline"
                    onClick={() => confirmDelete(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{userToDelete.name}</strong>?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => deleteUser(userToDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>

            {formError && <div className="text-red-500 mb-4">{formError}</div>}

            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={createUser}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            {formError && <div className="text-red-500 mb-4">{formError}</div>}

            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editUser.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={editUser.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={updateUser}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
