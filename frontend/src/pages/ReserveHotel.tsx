import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function ReserveHotel() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hotelName = searchParams.get("hotelName") || ""; 
  const hotelId = searchParams.get("hotelId") || ""; 
  const navigate = useNavigate();

  console.log("Hotel Name:", hotelName);
  console.log("Hotel ID:", hotelId);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", 
    phone: "", 
    indate: "",
    outdate: "",
    guests: 1,
    hotel: hotelId || "",
  });

  const token = localStorage.getItem("token");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const minCheckOutDate = formData.indate
    ? new Date(new Date(formData.indate).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/reservation/createReservation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Reservation successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          indate: "",
          outdate: "",
          guests: 1,
          hotel: hotelId || "",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Failed to create reservation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-green-600 to-blue-700">
            <h1 className="text-4xl font-bold text-white">Reserve Your Stay</h1>
            <p className="text-blue-100 mt-2">Complete your reservation below.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
              <input
                type="text"
                name="hotelName"
                value={hotelName} 
                readOnly
                className="pl-4 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-In Date</label>
                <input
                  type="date"
                  name="indate"
                  value={formData.indate}
                  onChange={handleInputChange}
                  className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date</label>
                <input
                  type="date"
                  name="outdate"
                  value={formData.outdate}
                  min={minCheckOutDate}
                  disabled={!formData.indate}
                  onChange={handleInputChange}
                  className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                min="1"
                max="10"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-700 text-white p-3 rounded-lg hover:opacity-90"
            >
              Reserve Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReserveHotel;