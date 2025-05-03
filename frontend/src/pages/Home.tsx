import React, { useState } from 'react';
import { Search, Bed, Coffee, Wifi, Car, ArrowRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Link } from "react-router-dom";
import Footer from '../components/Footer'; // Import Footer component

export type hotel = {
  _id: string; 
  name: string;
  location: string;
  price: number;
  numberOfRooms: number;
  bookedRooms: number;
  description: string;
  image: string;
};

function Home() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/auth';
  }

  const [data, setData] = useState([] as hotel[]);
  const [searchType, setSearchType] = useState('name'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchPerformed, setIsSearchPerformed] = useState(false); 
  const [sortOrder, setSortOrder] = useState(''); // State for sorting order

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/v1/hotel/search`,
        {
          params: {
            type: searchType, 
            query: searchQuery, 
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data) {
        setData(res.data); 
        setIsSearchPerformed(true); 
      } else {
        setData([]); 
        setIsSearchPerformed(true); 
      }
    } catch (err) {
      console.error('Error during search:', err);
      setData([]); 
      setIsSearchPerformed(true); 
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/v1/hotel/getHotel`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data) {
        setData(res.data); 
      }
    } catch (err) {
      console.error('Error fetching featured hotels:', err);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  // Sort the data based on the selected sort order
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return a.price - b.price; // Sort by price ascending
    } else if (sortOrder === 'high-to-low') {
      return b.price - a.price; // Sort by price descending
    }
    return 0; // No sorting
  });

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50">
        
        <div
          className="relative w-full h-[800px] bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/pokharaa.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-10">
            <h1 className="text-6xl font-extrabold text-white mb-6 mt-12"> 
              Find Your Perfect Stay
            </h1>
            <p className="text-lg text-white max-w-2xl mb-8">
              Discover luxury accommodations at the best prices. Book your dream hotel stay with us today.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search By
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition duration-200"
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="name">Hotel Name</option>
                    <option value="location">Location</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Query
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={
                        searchType === 'name' ? 'Enter hotel name' : 'Enter location'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 hover:shadow-lg transition duration-200"
                    onClick={handleSearch}
                  >
                    Search Hotels
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                {isSearchPerformed ? 'Search Results' : 'Available Hotels'}
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sort By Price
                </label>
                <select
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition duration-200 bg-white text-gray-700"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="" className="text-gray-500">Select</option>
                  <option value="low-to-high" className="text-gray-700">Low to High</option>
                  <option value="high-to-low" className="text-gray-700">High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sortedData.length > 0 ? (
                sortedData.map((hotel, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div onClick={() => window.location.href = `/hotel-details/${hotel._id}`}>
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3> 
                      <p className="text-gray-600 mb-4">{hotel.location}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-blue-600">
                          Rs. {hotel.price}
                          <span className="text-sm text-gray-600">/night</span>
                        </p>
                      </div>
                      
                      <Link
                        to={`/reserve-hotel?hotelName=${hotel.name}&hotelId=${hotel._id}`}
                        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Reserve Now
                      </Link>
                      <button
                        onClick={() =>
                          window.location.href = `/book-hotel?hotelId=${hotel._id}&hotelName=${hotel.name}&hotelPrice=${hotel.price}`
                        }
                        disabled={hotel.numberOfRooms === hotel.bookedRooms}
                        className={`w-full flex flex-col items-center justify-center px-4 py-2 mt-4  text-white rounded-lg  group ${hotel.numberOfRooms === hotel.bookedRooms?"cursor-not-allowed bg-red-600 hover:bg-red-700":"bg-green-600 hover:bg-green-700"}`}
                      >
                        <span>
                        {
                          hotel.numberOfRooms === hotel.bookedRooms
                            ? 'Fully Booked'
                            : 'Book Now'
                        }
                        </span>
                        <span>
                        {
                          ` (${hotel.numberOfRooms - hotel.bookedRooms} rooms available)`
                                                    
                        }
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                ))

              ) : (
                <p className="text-center text-gray-600">
                  {isSearchPerformed
                    ? 'No hotels found. Try searching for something else.'
                    : 'No available hotels at the moment.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;