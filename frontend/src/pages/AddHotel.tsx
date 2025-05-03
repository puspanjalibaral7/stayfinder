import React, { useState } from "react";
import { Building2, MapPin, BedDouble } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function AddHotel() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    numberOfRooms: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // State for the uploaded image file
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      // Upload the image to the backend or a cloud service
      const formDataForImage = new FormData();
      formDataForImage.append("image", imageFile);

      const imageUploadResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}v1/hotel/uploadImage`, // Backend endpoint for image upload
        formDataForImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = imageUploadResponse.data.imageUrl; // Get the uploaded image URL from the response

      // Submit the hotel data along with the image URL
      const hotelData = { ...formData, image: imageUrl };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}v1/hotel/createHotel`,
        hotelData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Hotel Added Successfully!");
        setFormData({
          name: "",
          location: "",
          price: "",
          description: "",
          numberOfRooms: "",
        });
        setImageFile(null); // Reset the image file
      }
    } catch (err) {
      toast.error("Failed to Add Hotel");
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Set the selected image file
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-12"
      style={{
        backgroundImage:
          'url("https://upload.wikimedia.org/wikipedia/commons/b/b7/Phewa_lake%2C_Pokhara.jpg")',
      }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-green-600 to-blue-700">
            <h1 className="text-4xl font-bold text-white">Add New Hotel</h1>
            <p className="text-blue-100 mt-2">
              List your hotel on StayFinder and reach more customers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your hotel name here"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your hotel's location here"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="pl-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price in rupees"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms
                </label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter total number of available rooms."
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe about your hotel..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200"
            >
              Add Hotel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddHotel;