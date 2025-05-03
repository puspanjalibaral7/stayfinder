import React, { useEffect, useState } from "react";

const ReservationDetails = () => {
  interface Reservation {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    indate: Date;
    outdate: Date;
    guests: number;
    hotel: {
      name: string; 
    };
  }

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null); 
  const [formData, setFormData] = useState<Partial<Reservation>>({}); 

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging log

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
      const res = await fetch(`${baseUrl}/reservation/getReservation`, { method: "GET", headers });

      if (!res.ok) throw new Error("Failed to fetch reservations");

      const data = await res.json();
      setReservations(data);
      setError("");
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData(reservation); 
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingReservation) return;

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("Updating reservation with ID:", editingReservation._id);
    console.log("Form data being sent:", formData);

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/reservation/updateReservation/${editingReservation._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Failed to update reservation");
      }

      const updatedReservation = await res.json();
      console.log("Reservation updated successfully:", updatedReservation);

     
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === updatedReservation.reservation._id ? updatedReservation.reservation : reservation
        )
      );

      setEditingReservation(null); 
      setFormData({});
    } catch (err) {
      console.error("Error updating reservation:", err);
      alert("Failed to update reservation. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("Deleting reservation with ID:", id);

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/reservation/deleteReservation/${id}`, {
        method: "DELETE",
        headers,
      });

      console.log("Server response:", res);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Failed to delete reservation");
      }

      const responseMessage = await res.json();
      console.log("Reservation deleted successfully:", responseMessage);

      
      setReservations((prev) => prev.filter((reservation) => reservation._id !== id));
    } catch (err) {
      console.error("Error deleting reservation:", err);
      alert("Failed to delete reservation. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Reservation Details</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Hotel Name</th> {/* Hotel Name */}
            <th className="border border-gray-300 px-4 py-2 text-left">Check-In</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Check-Out</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Guests</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{reservation.firstName}</td>
              <td className="border border-gray-300 px-4 py-2">{reservation.lastName}</td>
              <td className="border border-gray-300 px-4 py-2">{reservation.email}</td>
              <td className="border border-gray-300 px-4 py-2">{reservation.phone}</td>
              <td className="border border-gray-300 px-4 py-2">{reservation.hotel?.name || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(reservation.indate).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(reservation.outdate).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{reservation.guests}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleEditClick(reservation)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                  onClick={() => handleDelete(reservation._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingReservation && (
        <div className="mt-6 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-bold mb-4">Update Reservation</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Check-In</label>
              <input
                type="date"
                name="indate"
                value={formData.indate ? new Date(formData.indate).toISOString().split("T")[0] : ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Check-Out</label>
              <input
                type="date"
                name="outdate"
                value={formData.outdate ? new Date(formData.outdate).toISOString().split("T")[0] : ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Guests</label>
              <input
                type="number"
                name="guests"
                value={formData.guests || ""}
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4"
              onClick={() => setEditingReservation(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationDetails;