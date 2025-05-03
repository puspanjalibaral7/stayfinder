import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building, ClipboardList, Users, FileText } from 'lucide-react'; 
import NavBar from '../components/NavBar'; 

const AdminPanel = () => {
  const navigate = useNavigate();

  const backgroundImagePath = '/images/pokhara.jpg';

  return (
    <>
      <NavBar /> 
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImagePath})`,
        }}
      >
        <div className="p-6 space-y-10 bg-black bg-opacity-50 min-h-screen">
          <h1 className="text-4xl font-bold text-center text-white mb-8">Admin Panel</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/hotel-details')}
            >
              <Building className="w-10 h-10 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-center">Hotel Details</h2>
            </div>

            
            <div
              className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/reservation-details')}
            >
              <ClipboardList className="w-10 h-10 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-center">Reservation Details</h2>
            </div>

            
            <div
              className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/user-details')}
            >
              <Users className="w-10 h-10 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-center">User Details</h2>
            </div>

            
            <div
              className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/booking-details')}
            >
              <FileText className="w-10 h-10 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-center">Booking Details</h2>
            </div>

            <div
              className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/add-hotel')}
            >
              <Plus className="w-10 h-10 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-center">Add Hotel</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;