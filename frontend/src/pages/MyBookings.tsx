import React, { useEffect, useState } from "react";

const MyBookings = () => {
  interface Booking {
    _id: string;
    firstName: string;
    lastName: string;
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

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to access this page.");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/booking/user/get`, { method: "GET", headers });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data); // Set the bookings data
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Hotel Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Check-In</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Check-Out</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Guests</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{booking.hotel?.name || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{booking.guests}</td>
              <td className="border border-gray-300 px-4 py-2">Rs. {booking.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;