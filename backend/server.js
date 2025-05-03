import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import hotelRouter from "./routes/hotelRoute.js";
import reservationRouter from "./routes/reservationRoute.js";
import authRouter from "./routes/authRoute.js";
import bookingRouter from "./routes/bookingRoute.js";

import cors from "cors";

app.use("/api/hotels", hotelRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/users", authRouter); 
app.use("/api/auth", authRouter);
app.use("/api/v1/booking", bookingRouter);


app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Server Running On Port ${process.env.PORT}`);
});
