// import { SendEmailCommand } from "@aws-sdk/client-ses";
// import { sesClient } from "../SendEmail/sesClient.js";

// const createSendEmailCommand = (toAddress, fromAddress) => {
//   return new SendEmailCommand({
//     Destination: {
//       CcAddresses: [
//       ],
//       ToAddresses: [
//         toAddress,
//       ],
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: "UTF-8",
//           Data: "<h1>This is Email BODY</h1>",
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "This is the format of email",
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: "Hello world from ses",
//       },
//     },
//     Source: fromAddress,
//     ReplyToAddresses: [
//       /* more items */
//     ],
//   });
// };

// const run = async () => {
//   const sendEmailCommand = createSendEmailCommand(
//     "kapildahiya309@gmail.com",
//     "kapild@devconnect.com",
//   );

//   try {
//     return await sesClient.send(sendEmailCommand);
//   } catch (caught) {
//     if (caught instanceof Error && caught.name === "MessageRejected") {
//       const messageRejectedError = caught;
//       return messageRejectedError;
//     }
//     throw caught;
//   }
// };

// // snippet-end:[ses.JavaScript.email.sendEmailV3]
// export { run };


// src/utils/SendEmail/sendEmail.js




// import { SendEmailCommand } from "@aws-sdk/client-ses";
// import { sesClient } from "./sesClient.js";

// const sendEmail = async (toAddress, fromAddress) => {
//   const command = new SendEmailCommand({
//     Destination: {
//       ToAddresses: [toAddress],
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: "UTF-8",
//           Data: `<h1>DevConnect Invitation</h1><p>You have a new connection request on DevConnect. Log in to respond.</p>`,
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "You have a new connection request on DevConnect.",
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: "New Connection Request on DevConnect",
//       },
//     },
//     Source: fromAddress,
//     ReplyToAddresses: [fromAddress],
//   });

//   try {
//     const response = await sesClient.send(command);
//     return response;
//   } catch (error) {
//     if (error.name === "MessageRejected") {
//       return { error: "MessageRejected", details: error.message };
//     }
//     console.error("Email Send Error:", error);
//     throw error;
//   }
// };

// export { sendEmail };



// utils/SendEmail/sendEmail.js
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const sendEmail = async (toAddress, fromAddress, subject, htmlBody, textBody) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [fromAddress],
  });

  try {
    const response = await sesClient.send(command);
    return response;
  } catch (error) {
    if (error.name === "MessageRejected") {
      return { error: "MessageRejected", details: error.message };
    }
    console.error("Email Send Error:", error);
    throw error;
  }
};

export { sendEmail };
