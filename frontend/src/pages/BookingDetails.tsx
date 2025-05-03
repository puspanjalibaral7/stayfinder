import React, { useEffect, useState } from "react";

const BookingDetails = () => {
  interface Booking {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string; 
    checkInDate: Date;
    checkOutDate: Date;
    guests: number;
    totalPrice: number;
    hotel: {
      name: string; 
    };
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");

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
      const res = await fetch(`${baseUrl}/booking/getBooking`, { method: "GET", headers });

      console.log("Token:", token);
      console.log("API Response:", res);

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData(booking);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/booking/updateBooking/${editingBooking._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      const updatedBooking = await res.json();

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === updatedBooking.booking._id ? updatedBooking.booking : booking
        )
      );

      setEditingBooking(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/booking/deleteBooking/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Failed to delete booking");

      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking. Please try again.");
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
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th> 
            <th className="border border-gray-300 px-4 py-2 text-left">Hotel Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Check-In</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Check-Out</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Guests</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Total Price</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{booking.firstName}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.lastName}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.email}</td> 
              <td className="border border-gray-300 px-4 py-2">{booking.hotel?.name || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{booking.guests}</td>
              <td className="border border-gray-300 px-4 py-2">Rs. {booking.totalPrice}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleEditClick(booking)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                  onClick={() => handleDelete(booking._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingBooking && (
        <div className="mt-6 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-bold mb-4">Update Booking</h2>
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
              <label className="block font-semibold">Check-In</label>
              <input
                type="date"
                name="checkInDate"
                value={
                  formData.checkInDate
                    ? new Date(formData.checkInDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleFormChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Check-Out</label>
              <input
                type="date"
                name="checkOutDate"
                value={
                  formData.checkOutDate
                    ? new Date(formData.checkOutDate).toISOString().split("T")[0]
                    : ""
                }
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
            <div>
              <label className="block font-semibold">Total Price</label>
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice || ""}
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
              onClick={() => setEditingBooking(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;

