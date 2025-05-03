import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
  getAllBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  getBooking, 
} from "../controller/booking.js";

const bookingRouter = express.Router();

bookingRouter.get("/getBooking", verifyToken, getAllBooking);
bookingRouter.get("/user/get", verifyToken, getBooking);
bookingRouter.post("/createBooking", verifyToken, createBooking);
bookingRouter.put("/updateBooking/:id", verifyToken, updateBooking);
bookingRouter.delete("/deleteBooking/:id", verifyToken, deleteBooking);




export default bookingRouter;