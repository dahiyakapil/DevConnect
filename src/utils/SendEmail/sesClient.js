// import { SESClient } from "@aws-sdk/client-ses";
// // Set the AWS Region.
// const REGION = "eu-north-1";
// // Create SES service object.
// const sesClient = new SESClient({
//     region: REGION, credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY,
//         secretAccessKey: process.env.AWS_SECRET_KEY
//     }
// });
// export { sesClient };


// src/utils/SendEmail/sesClient.js

import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export { sesClient };

