import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import AddHotel from './pages/AddHotel';
import ReserveHotel from './pages/ReserveHotel';
import BookHotel from './pages/BookHotel';
import AdminPanel from './pages/AdminPanel';
import HotelDetails from "./pages/HotelDetails";
import ReservationDetails from "./pages/ReservationDetails";
import UserDetails from "./pages/UserDetails";
import BookingDetails from "./pages/BookingDetails";
import MyBookings from './pages/MyBookings';
import Hotel from './pages/Hotel';



function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signin" element={<Auth />} /> 
        <Route path="/signup" element={<Auth />} />
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/reserve-hotel" element={<ReserveHotel />} />
        <Route path="/book-hotel" element={<BookHotel />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/hotel-details" element={<HotelDetails />} />
        <Route path="/reservation-details" element={<ReservationDetails />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/hotel-details/:id" element={<Hotel />} />
     </Routes>
    </Router>
  );
}

export default App;
