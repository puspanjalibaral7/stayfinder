import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "be2021ce112@gces.edu.np", 
    pass: "ojwu oltp vbqp sdtr",        
  },
});

export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to, 
    subject, 
    text, 
    html, 
  };

  try {
    console.log("Sending email to:", to);
    console.log("Email subject:", subject);
    console.log("Email body (text):", text);
    console.log("Email body (html):", html);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error); 
    throw new Error("Failed to send email");
  }
};

