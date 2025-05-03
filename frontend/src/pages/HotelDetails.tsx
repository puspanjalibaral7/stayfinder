import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar.tsx"; 

const HotelDetails = () => {
  interface Hotel {
    _id: string;
    name: string;
    location: string;
    price: number;
    numberOfRooms: number;
    bookedRooms: number;
    description: string;
  }

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState<Partial<Hotel>>({});
  

  useEffect(() => {
    const fetchHotels = async () => {
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
        const res = await fetch(`${baseUrl}/hotel/getHotel`, { method: "GET", headers });

        if (!res.ok) throw new Error("Failed to fetch hotels");

        const data = await res.json();
        setHotels(data);
        setError("");
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleEditClick = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormData(hotel);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingHotel) return;

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/hotel/updateHotel/${editingHotel._id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update hotel");

      const updatedHotel = await res.json();

      setHotels((prev) =>
        prev.map((hotel) => (hotel._id === updatedHotel._id ? updatedHotel : hotel))
      );

      setEditingHotel(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating hotel:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const handleDelete = async (hotelId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in as an admin to access this page.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const baseUrl = "http://localhost:4000/api/v1";
      const res = await fetch(`${baseUrl}/hotel/deleteHotel/${hotelId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) throw new Error("Failed to delete hotel");

      setHotels((prev) => prev.filter((hotel) => hotel._id !== hotelId));
    } catch (err) {
      console.error("Error deleting hotel:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Hotel Details</h1>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Hotel Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Number of Rooms</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Number of booked rooms</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{hotel.name}</td>
                <td className="border border-gray-300 px-4 py-2">{hotel.location}</td>
                <td className="border border-gray-300 px-4 py-2">{hotel.price}</td>
                <td className="border border-gray-300 px-4 py-2">{hotel.numberOfRooms}</td>
                <td className="border border-gray-300 px-4 py-2">{hotel.bookedRooms}</td>
                <td className="border border-gray-300 px-4 py-2">{hotel.description}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleEditClick(hotel)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(hotel._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingHotel && (
          <div className="mt-6 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-4">Update Hotel</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold">Hotel Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleFormChange}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleFormChange}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleFormChange}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Number of Rooms</label>
                <input
                  type="number"
                  name="numberOfRooms"
                  value={formData.numberOfRooms || ""}
                  onChange={handleFormChange}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
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
                onClick={() => setEditingHotel(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HotelDetails;