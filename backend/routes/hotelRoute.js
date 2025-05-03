import express from "express";
import multer from "multer";
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  searchHotels,
  uploadImage,
} from "../controller/hotelController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const upload = multer({ dest: "uploads/" });
const hotelRouter = express.Router();
hotelRouter.use(verifyToken);

hotelRouter.post("/createHotel", createHotel);
hotelRouter.get("/getHotel", getHotels);
hotelRouter.get("/getHotel/:id", getHotelById);
hotelRouter.put("/updateHotel/:id", updateHotel);
hotelRouter.delete("/deleteHotel/:id", deleteHotel);
hotelRouter.get("/search", searchHotels);
hotelRouter.post("/uploadImage", upload.single("image"), uploadImage);

export default hotelRouter;