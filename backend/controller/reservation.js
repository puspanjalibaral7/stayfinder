import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { Hotel } from "../models/hotelSchema.js";
import { Reservation } from "../models/reservationSchema.js";
import { sendEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";

export const getAllReservations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); 
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const reservations = await Reservation.find().populate("hotel", "name");

    console.log("Reservations fetched successfully:", reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Server error while fetching reservations" });
  }
};

export const getReservation = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("hotel", "name"); // Populate hotel name
    console.log("Fetched reservations:", reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Server error while fetching reservations" });
  }
};

export const sendReservation = async (req, res) => {
  const { firstName, lastName, email, phone, indate, outdate, guests, hotel } = req.body;
  
  try {
    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      phone,
      indate,
      outdate,
      guests,
      hotel, // Save the hotel reference
    });
    const hotelDetails = await Hotel.findById(hotel);
    if(!hotelDetails) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    // Send confirmation email
    const subject = "Reservation Confirmation";
    const text = `Dear ${firstName} ${lastName},\n\nYour reservation at ${hotel} has been confirmed.\n\nDetails:\nCheck-In: ${indate}\nCheck-Out: ${outdate}\nGuests: ${guests}\n\nThank you for choosing us!`;
    const html = `
      <h1>Reservation Confirmation</h1>
      <p>Dear ${firstName} ${lastName},</p>
      <p>Your reservation at ${hotelDetails.name} has been confirmed.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Check-In: ${new Date(indate).toLocaleDateString()}</li>
        <li>Check-Out: ${new Date(outdate).toLocaleDateString()}</li>
        <li>Guests: ${guests}</li>
      </ul>
      <p>Thank you for choosing us!</p>
    `;

    console.log("Reservation email:", email);
    sendEmail(email, subject, text, html);
    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ success: false, message: "Failed to create reservation" });
  }
};

// Update a reservation
export const updateReservation = async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email, indate, outdate, phone, guests } = req.body;

  try {
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return next(new ErrorHandler("Reservation not found", 404));
    }

    reservation.firstName = firstName || reservation.firstName;
    reservation.lastName = lastName || reservation.lastName;
    reservation.email = email || reservation.email;
    reservation.indate = indate || reservation.indate;
    reservation.outdate = outdate || reservation.outdate;
    reservation.phone = phone || reservation.phone;
    reservation.guests = guests || reservation.guests;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Server error while updating reservation" });
  }
};

// Delete a reservation
export const deleteReservation = async (req, res) => {
  console.log("Deleting reservation with ID:", req.params.id);

  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      console.error("Reservation not found");
      return res.status(404).json({ message: "Reservation not found" });
    }

    console.log("Reservation deleted successfully:", reservation);
    res.status(200).json({ message: "Reservation deleted successfully." });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Server error while deleting reservation" });
  }
};
export const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
};

