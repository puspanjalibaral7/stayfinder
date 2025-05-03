import axios from "axios";
import { Star, MapPin } from "lucide-react"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

type Hotel = {
    _id: string;
    name: string;
    location: string;
    price: number;
    numberOfRooms: number;
    bookedRooms: number;
    description: string;
    image: string;
}

export default function HotelPage() {
    const [hotel, setHotel] = useState({} as Hotel);
    const token = localStorage.getItem("token")
    const id = (useParams()).id;
    
    const handleFetch = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/hotels/getHotel/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setHotel(response.data)
            // const data = await response.json()
            // console.log(data)
        } catch (error) {
            console.error("Error fetching hotel data:", error)
        }
    }

    useEffect(() => {
        handleFetch()
    }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-900">
          Hotels
        </Link>
        <span>/</span>
        <span className="text-gray-900">{hotel.name}</span>
      </div>

      {/* Hotel Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{hotel.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              <span>{hotel.location}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Share</button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Save</button> */}
          <button className="px-3 py-1 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700">Book Now</button>
        </div>
      </div>

      {/* Single Image */}
      <div className="relative mb-8 rounded-lg overflow-hidden">
        <img
          src={hotel?.image}
          alt="Hotel view"
          width={700}
          height={400}
          className="object-cover w-full h-[400px]"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Hotel Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About {hotel.name}</h2>
            <p className="text-gray-600 mb-4">
                {hotel.description}
            </p>
          </div>
        </div>

        {/* Right Column - Hotel Policies and Booking Buttons */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Booking Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">Rs. {hotel.price}</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="py-3 px-4 border bg-indigo-600 border-gray-300 rounded-md font-medium hover:bg-indigo-700 text-white" onClick={() => window.location.href = `/reserve-hotel?hotelName=${hotel.name}&hotelId=${hotel._id}`}>
                      Reserve
                    </button>
                    <button className="py-3 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700" onClick={() => window.location.href = `/book-hotel?hotelId=${hotel._id}&hotelName=${hotel.name}&hotelPrice=${hotel.price}`}>
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Policies */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Hotel Policies</h3>
              </div>
              <div className="p-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium">3:00 PM - 12:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium">Until 11:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancellation</span>
                  <span className="font-medium">Free until 48h before</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
