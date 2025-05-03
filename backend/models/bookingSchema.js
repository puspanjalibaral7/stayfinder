import mongoose from "mongoose";
import validator from "validator";

const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [2, "First name must be at least 2 characters long"],
    maxLength: [30, "First name cannot exceed 30 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [2, "Last name must be at least 2 characters long"],
    maxLength: [30, "Last name cannot exceed 30 characters"],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: [1, "At least 1 guest is required"],
    max: [10, "Maximum 10 guests are allowed"],
  },
  email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Provide a valid email"],
    },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total price must be a positive number"],
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  
});

export const Booking = mongoose.model("Booking", bookingSchema);