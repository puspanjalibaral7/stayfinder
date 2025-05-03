import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function BookHotel() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hotelName = searchParams.get("hotelName") || "";
  const hotelId = searchParams.get("hotelId") || "";
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", 
    hotel: hotelId || "",
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "checkInDate") {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        toast.error("Check-In Date cannot be in the past.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        checkInDate: value,
        checkOutDate: value > prev.checkOutDate ? "" : prev.checkOutDate,
      }));
    } else if (name === "checkOutDate") {
      if (formData.checkInDate && value <= formData.checkInDate) {
        toast.error("Check-Out Date must be at least one day after Check-In Date.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        checkOutDate: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      checkInDate: new Date(formData.checkInDate).toISOString(),
      checkOutDate: new Date(formData.checkOutDate).toISOString(),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/booking/createBooking`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Booking successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          hotel: hotelId || "",
          checkInDate: "",
          checkOutDate: "",
          guests: 1,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minCheckOutDate = formData.checkInDate
    ? new Date(new Date(formData.checkInDate).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : "";

  return (
    <div className="min-h-screen bg-cover bg-center py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-green-600 to-blue-700">
            <h1 className="text-4xl font-bold text-white">Book Your Stay</h1>
            <p className="text-blue-100 mt-2">Complete your booking below.</p>
          </div>

          <form onSubmit={handleBooking} className="p-8 space-y-8">
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
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                  min={today}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out Date</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  className="pl-4 w-full p-3 border border-gray-300 rounded-lg"
                  min={minCheckOutDate}
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
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookHotel;