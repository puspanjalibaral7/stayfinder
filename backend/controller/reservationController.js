import { sendEmail } from "../utils/emailService.js";
import { Reservation } from "../models/reservationSchema.js";
import { sendEmail } from "../utils/emailService.js";

export const createReservation = async (req, res) => {
  const { firstName, lastName, email, phone, indate, outdate, guests } = req.body;

  try {
    // Save the reservation to the database
    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      phone,
      indate,
      outdate,
      guests,
      hotel,
    });

    // Send confirmation email
    const subject = "Reservation Confirmation";
    const text = `Dear ${firstName} ${lastName},\n\nYour reservation at ${hotel} has been confirmed.\n\nDetails:\nCheck-In: ${indate}\nCheck-Out: ${outdate}\nGuests: ${guests}\n\nThank you for choosing us!`;
    const html = `
      <h1>Reservation Confirmation</h1>
      <p>Dear ${firstName} ${lastName},</p>
      <p>Your reservation at ${hotel} has been confirmed.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Check-In: ${new Date(indate).toLocaleDateString()}</li>
        <li>Check-Out: ${new Date(outdate).toLocaleDateString()}</li>
        <li>Guests: ${guests}</li>
      </ul>
      <p>Thank you for choosing us!</p>
    `;

    console.log("Reservation email:", email);
    await sendEmail(email, subject, text, html);

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ success: false, message: "Failed to create reservation" });
  }
};

export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, indate, outdate, guests } = req.body;

  try {
    // Update the reservation in the database
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone, indate, outdate, guests },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    console.log("Reservation ID:", id);
    console.log("Updated reservation data:", reservation);

    // Validate email
    if (!email) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    // Send update email
    const subject = "Reservation Updated";
    const text = `Dear ${firstName} ${lastName},\n\nYour reservation has been updated.\n\nDetails:\nCheck-In: ${indate}\nCheck-Out: ${outdate}\nGuests: ${guests}\n\nThank you for choosing us!`;
    const html = `
      <h1>Reservation Updated</h1>
      <p>Dear ${firstName} ${lastName},</p>
      <p>Your reservation has been updated.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Check-In: ${new Date(indate).toLocaleDateString()}</li>
        <li>Check-Out: ${new Date(outdate).toLocaleDateString()}</li>
        <li>Guests: ${guests}</li>
      </ul>
      <p>Thank you for choosing us!</p>
    `;

    console.log("Reservation email:", email);
    console.log("Calling sendEmail function for reservation update...");
    await sendEmail(email, subject, text, html);
    console.log("sendEmail function executed successfully for reservation update");

    res.status(200).json({ success: true, reservation });
  } catch (error) {
    console.error("Error updating reservation or sending email:", error.message);
    res.status(500).json({ success: false, message: "Failed to update reservation or send email" });
  }
};