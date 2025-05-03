import { Booking } from "../models/bookingSchema.js";
import { User } from "../models/userSchema.js";
import { Hotel } from "../models/hotelSchema.js";

export const getAllBooking = async (req, res) => {
  try {
    const email = req.user.email;
    const bookings = await Booking.find()
      .populate("hotel", "name price");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};

export const getBooking = async (req, res) => {
  try {
    const email = req.user.email;
    const booking = await Booking.find({"email": email})
      .populate("hotel", "name price");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error while fetching booking" });
  }
}

export const createBooking = async (req, res) => {
  const { firstName, lastName, email, hotel, checkInDate, checkOutDate, guests } = req.body;

  if (!firstName || !lastName || !email || !hotel || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hotelDetails = await Hotel.findById(hotel);
    if (!hotelDetails) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if(hotelDetails.bookedRooms == hotelDetails.numberOfRooms){
      return res.status(400).json({ message: "No rooms available" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    const totalPrice = numberOfNights * hotelDetails.price;

    const booking = await Booking.create({
      firstName,
      lastName,
      email,
      hotel,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalPrice,
    });
    if(!hotelDetails.bookedRooms){
      hotelDetails.bookedRooms = 0;
    }
    hotelDetails.bookedRooms += 1;
    await hotelDetails.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, checkInDate, checkOutDate, guests, totalPrice, status } = req.body;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.firstName = firstName || booking.firstName;
    booking.lastName = lastName || booking.lastName;
    booking.email = email || booking.email;
    booking.checkInDate = checkInDate || booking.checkInDate;
    booking.checkOutDate = checkOutDate || booking.checkOutDate;
    booking.guests = guests || booking.guests;
    booking.totalPrice = totalPrice || booking.totalPrice;
    booking.status = status || booking.status;

    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error while updating booking" });
  }
};

export const deleteBooking = async (req, res) => {
  console.log("Request Body:", req.body); 
  console.log("Deleting booking with ID:", req.params.id);

  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      console.error("Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking deleted successfully:", booking);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Server error while deleting booking" });
  }
};