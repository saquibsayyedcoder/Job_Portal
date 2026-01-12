// // utils/sendEmail.js
// import nodeMailer from "nodemailer";

// export const sendEmail = async ({ email, subject, message, html }) => {
//   // Validate required fields
//   if (!email || !subject) {
//     throw new Error("Email and subject are required.");
//   }

//   // Create transporter
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMTP_HOST,
//     service: process.env.SMTP_SERVICE, // e.g., 'Gmail', 'Outlook'
//     port: parseInt(process.env.SMTP_PORT, 10) || 587,
//     secure: process.env.SMTP_PORT === "465", // Use SSL/TLS if port 465
//     auth: {
//       user: process.env.SMTP_MAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//     // Optional: Improve deliverability
//     tls: {
//       rejectUnauthorized: false, // Set to true in production with valid certs
//     },
//   });

//   // Define email options
//   const mailOptions = {
//     from: `"HonorFreelance" <${process.env.SMTP_MAIL}>`, // Better sender name
//     to: email,
//     subject,
//     text: message || null, // Fallback plain text
//     html: html || message || null, // Prefer HTML if provided
//   };

//   try {
//     // Send email
//     const info = await transporter.sendMail(mailOptions);

//     console.log("✅ Email sent successfully!");
//     console.log("Message ID:", info.messageId);
    
//     // Useful during development (especially with Ethereal)
//     if (process.env.NODE_ENV === "development") {
//       console.log("Preview URL:", nodeMailer.getTestMessageUrl(info));
//     }

//     return info;
//   } catch (error) {
//     console.error("❌ Error sending email:", error);

//     // Enhance error details
//     if (error.code === "EAUTH") {
//       console.error("Check your SMTP credentials and app password.");
//     }
//     if (error.responseCode === 535) {
//       console.error("SMTP authentication failed. Verify email & password.");
//     }

//     throw new Error(`Failed to send email: ${error.message}`);
//   }
// };


// utils/sendEmail.js
import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message, html }) => {
  if (!email || !subject) {
    throw new Error("Email and subject are required.");
  }

  // Use service OR host, not both
  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE, // e.g., 'Gmail'
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === "465", // true for 465, false for others
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // Remove unsafe tls config in production
    // tls: { rejectUnauthorized: false } ← Only for dev if needed
  });

  const mailOptions = {
    from: `"HonorFreelance" <${process.env.SMTP_MAIL}>`,
    to: email,
    subject,
    text: message || null,
    html: html || message || null,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL:", nodeMailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    if (error.code === "EAUTH") {
      console.error("Authentication failed. Check SMTP_MAIL and SMTP_PASSWORD.");
    }
    if (error.responseCode === 535) {
      console.error("SMTP login rejected. Verify credentials and app password.");
    }
    throw error; // Will be caught in forgotPassword controller
  }
};