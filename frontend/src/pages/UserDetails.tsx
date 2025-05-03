import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar.tsx"; 

const UserDetails = () => {
  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string; 
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); 

    if (!token) {
      setError("You must be logged in as an admin to access this page.");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/auth/getUser`, { method: "GET", headers });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <NavBar /> 
      <div className="p-6 space-y-10">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{user.firstName}</td>
                <td className="border border-gray-300 px-4 py-2">{user.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserDetails;