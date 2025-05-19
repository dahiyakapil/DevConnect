// import cron from "node-cron";
// import ConnectionRequest from "../models/connectionRequest.model.js";
// import { endOfDay, startOfDay, subDays } from "date-fns"
// import { sendEmail } from "../utils/SendEmail/sendEmail.js"

// cron.schedule("19 19 * * *", async () => {
//     try {

//         const yesterday = subDays(new Date(), 0);
//         const yesterdayStart = startOfDay(yesterday);
//         const yesterdayEnd = endOfDay(yesterday);


//         const pendingRequests = await ConnectionRequest.find({
//             status: "interested",
//             createdAt: {
//                 $gte: yesterdayStart,
//                 $lt: yesterdayEnd
//             }
//         }).populate("fromUserId toUserId");

//         const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.email))];

//         console.log(listOfEmails)

//         for (const email of listOfEmails) {
//             try {
//                 console.log("Sending to:", email);
//                 const res = await sendEmail(email,
//                     "kapil@devconnect.biz", // sender
//                     "Reminder: Pending Connection Requests on DevConnect",
//                     `<p>You have pending connection requests on <strong>DevConnect</strong> from yesterday. Log in to view and respond.</p>`,
//                     "You have pending connection requests on DevConnect. Log in to view and respond.");
//                     console.log(res)
//             } catch (error) {
//                 console.log(error)
//             }
//         }


//     } catch (error) {
//         console.log(error)
//     }
// });



// import cron from "node-cron";
// import ConnectionRequest from "../models/connectionRequest.model.js";
// import { endOfDay, startOfDay, subDays } from "date-fns";
// import { sendEmail } from "../utils/SendEmail/sendEmail.js";

// cron.schedule("37 19 * * *", async () => {
//     try {
//         const yesterday = subDays(new Date(), 0);
//         const yesterdayStart = startOfDay(yesterday);
//         const yesterdayEnd = endOfDay(yesterday);

//         // Fetch all pending connection requests from yesterday
//         const pendingRequests = await ConnectionRequest.find({
//             status: "interested",
//             createdAt: {
//                 $gte: yesterdayStart,
//                 $lt: yesterdayEnd
//             }
//         }).populate("fromUserId toUserId");

//         // Extract unique recipient emails
//         const uniqueEmails = [...new Set(pendingRequests.map(req => req.toUserId.email))];

//         if (uniqueEmails.length === 0) {
//             console.log("No pending requests found.");
//             return;
//         }

//         console.log("Pending emails to notify about:", uniqueEmails);

//         // Create an HTML list of these emails
//         const htmlList = uniqueEmails.map(email => `<li>${email}</li>`).join("");

//         const htmlBody = `
//             <h2>DevConnect - Pending Friend Requests Summary</h2>
//             <p>The following users have pending friend requests from yesterday:</p>
//             <ul>${htmlList}</ul>
//             <p>Please login to DevConnect to view the requests.</p>
//         `;

//         const textBody = `
// Pending Friend Requests from Yesterday on DevConnect:
// ${uniqueEmails.join("\n")}

// Please login to DevConnect to take action.
//         `;

//         // Hardcoded recipient
//         const hardcodedEmail = "kapildahiya308@gmail.com";

//         const res = await sendEmail(

//             "kapildahiya308@gmail.com",
//             "kapil@devconnect.biz", // sender
//             "Summary: Yesterday’s Pending Connection Requests",
//             htmlBody,
//             textBody
//         );

//         console.log("Summary email sent:", res);

//     } catch (error) {
//         console.error("Cron job error:", error);
//     }
// });




import cron from "node-cron";
import ConnectionRequest from "../models/connectionRequest.model.js";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { sendEmail } from "../utils/SendEmail/sendEmail.js";

cron.schedule("59 19 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 0); // 1 for actual yesterday
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.email))];

        if (listOfEmails.length === 0) {
            console.log("No pending requests found.");
            return;
        }

        const adminEmail = "kapildahiya308@gmail.com";

        for (const email of listOfEmails) {
            const subject = `New Friend Request pending for ${email}`;
            const htmlBody = `
                <h3>Pending Friend Request Alert</h3>
                <p>A user has a pending connection request from yesterday on <strong>DevConnect</strong>.</p>
                <p><strong>Recipient:</strong> ${email}</p>
                <p>Please login to devconnect.biz to view and respond to the request.</p>
            `;
            const textBody = `New friend request pending for ${email}. Please check DevConnect.`;

            try {
                console.log("Sending to:", email);
                const res = await sendEmail(
                    adminEmail,
                    "kapil@devconnect.biz",
                    subject,
                    htmlBody,
                    textBody
                );
                console.log("Email sent:", res);
            } catch (error) {
                console.error("Failed to send email for", email, error);
            }
        }

    } catch (error) {
        console.error("Cron job error:", error);
    }
});
