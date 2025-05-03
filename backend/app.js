import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import{ dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from './routes/reservationRoute.js';
import authRouter from "./routes/authRoute.js";
import hotelRouter from "./routes/hotelRoute.js";
import bookingRouter from "./routes/bookingRoute.js";


const app = express();
dotenv.config({path:"./config/config.env"});

app.use(
    cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use('/api/v1/reservation',reservationRouter);
app.use('/api/v1/auth',authRouter);
app.use ('/api/v1/hotel',hotelRouter);
app.use('/api/v1/booking', bookingRouter);
app.use("/uploads", express.static("uploads"));

dbConnection();

app.use(errorMiddleware)

export default app;
