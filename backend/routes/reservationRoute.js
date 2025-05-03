import express from "express";
import {verifyToken} from "../middlewares/authMiddleware.js"
import { sendReservation, getAllReservations,updateReservation,deleteReservation } from "../controller/reservation.js";




const reservationRouter = express.Router();

reservationRouter.get("/getReservation", verifyToken, getAllReservations);
reservationRouter.post("/createReservation",verifyToken, sendReservation);
reservationRouter.put("/updateReservation/:id", verifyToken, updateReservation);
reservationRouter.delete("/deleteReservation/:id", verifyToken, deleteReservation);

export default reservationRouter;
