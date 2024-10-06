import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Define a type for the user data
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
  };
}

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  // Get Single User Detail based on user Id
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg mt-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center py-2 px-0 hover:text-blue-600 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>{" "}
        <span className="pl-2">Go Back</span>
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center underline">
        User Detail
      </h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">{user.name}</h2>
      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-bold">Email: </span>
          {user.email}
        </p>
        <p>
          <span className="font-bold">Phone: </span>
          {user.phone}
        </p>
        <p>
          <span className="font-bold">Address: </span>
          {user.address.street}, {user.address.city}
        </p>
      </div>
    </div>
  );
};

export default UserDetail;
