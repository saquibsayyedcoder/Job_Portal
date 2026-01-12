import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import fetch from "node-fetch"; // Make sure to install node-fetch

// Utility function to send WhatsApp messages
const sendWhatsApp = async (to, message) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `http://wa.techrush.in/api/authkeywa-api.php?authkey=333361697a747377613130301748931177&route=68&number=${to}&message=${encodedMessage}`;

  try {
    const response = await fetch(whatsappUrl);
    const result = await response.text();
    console.log(`WhatsApp message sent to ${to}:`, result);
    return result;
  } catch (error) {
    console.error(`Failed to send WhatsApp to ${to}:`, error.message);
    return null;
  }
};

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Cron Automation.");
    const jobs = await Job.find({ newsLettersSent: false });

    for (const job of jobs) {
      try {
        const filterUsers = await User.find({
          $or: [
            { "jobs.firstJob": job.jobJob },
            { "jobs.secondJob": job.jobJob },
            { "jobs.thirdJob": job.jobJob },
          ],
        });

        for (const user of filterUsers) {
          const subject = `📢 Job Alert: ${job.companyName} is Hiring for ${job.title}`;

          const message = `Hi ${user.name},

Great news! A new job that matches your profile has just been posted.

🧾 Job Details:
- Position: ${job.title}
- Company: ${job.companyName}
- Location: ${job.location}
- Salary: ${job.salary}

Don't wait too long – positions like these fill quickly!

We’re here to support you in your job search.

Best Regards,  
Honor Freelance Team`;

          const html = `
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>🎉 <strong>Great news!</strong> A new job that matches your profile has just been posted on <strong>Honor Freelance</strong>.</p>
            <h3 style="color:#4CAF50;">📌 Job Details:</h3>
            <ul>
              <li><strong>Position:</strong> ${job.title}</li>
              <li><strong>Company:</strong> ${job.companyName}</li>
              <li><strong>Location:</strong> ${job.location}</li>
              <li><strong>Salary:</strong> ${job.salary}</li>
            </ul>
            <p>💼 <strong>Don't wait👀 too long</strong> – jobs like these are filled quickly!</p>
            <p>We’re here to support you in your job search. Best of luck!</p>
            <p style="margin-top: 20px;">Warm regards,<br/><strong>Honor Freelance Team</strong></p>
          `;

          // Send Email
          try {
            await sendEmail({
              email: user.email,
              subject,
              message,
              html,
            });
            console.log(`Email sent to ${user.email}`);
          } catch (emailError) {
            console.error(
              `Failed to send email to ${user.email}:`,
              emailError.message
            );
          }

          // Send WhatsApp if phone number exists
          if (user.phoneNumber) {
            const whatsappMessage = `
🚀 New Job Alert!
A job matching your profile is now available.

📄 Position: ${job.title}
🏢 Company: ${job.companyName}
📍 Location: ${job.location}
💰 Salary: ${job.salary}

Apply now before it’s filled!

Warm regards,
Honor Freelance Team
`;
            await sendWhatsApp(user.phoneNumber, whatsappMessage);
          } else {
            console.log(
              `No phone number found for ${user.name}, skipping WhatsApp.`
            );
          }
        }

        // Mark newsletter as sent
        job.newsLettersSent = true;
        await job.save();
        console.log(`Newsletter status updated for job: ${job.title}`);
      } catch (error) {
        console.error(
          "ERROR IN NODE CRON CATCH BLOCK:",
          error.message || "Unknown error"
        );
      }
    }
  });
};
