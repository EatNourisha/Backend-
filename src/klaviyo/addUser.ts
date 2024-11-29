import fetch from 'node-fetch';
 
async function registerAddKlaviyo(email: string, phone: string, first_name: string, last_name: string): Promise<void> {
    const listId: string = "VNhLtY"
  
    try {
      const endpoint: string = `https://a.klaviyo.com/api/v2/list/${listId}/members`;
      const payload = {
        api_key: process.env.klaviyoApiKey,
        profiles: [{ email, phone, first_name, last_name }],
      };
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log('Result from Klaviyo:', result);
    } catch (error) {
      console.error('Error adding user to Klaviyo list:', error);
    }
  }

// async function registerAddKlaviyo(email: string, phone: string, first_name: string, last_name: string): Promise<void> {
//   const listId: string = "U65kuQ"
//   // const listId: string = "VNhLtY"

//   try {
//     const endpoint: string = `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles`;
//     const payload = {
//       data: [
//         {
//           type: "profile",
//           attributes: {
//             email,
//             phone_number: phone, // Use "phone_number" as per v3 requirements
//             first_name,
//             last_name,
//           },
//         },
//       ],
//     };

//     // Fetch options
//     const options = {
//       method: "POST",
//       headers: {
//         accept: "application/vnd.api+json",
//         revision: "2024-10-15", // Specify the API revision for compatibility
//         "content-type": "application/vnd.api+json",
//         Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`, 
//       },
//       body: JSON.stringify(payload),
//     };

//     // Make the request
//     const response = await fetch(endpoint, options);

//     if (!response.ok) {
//       const errorDetails = await response.json();
//       throw new Error(
//         `Request failed with status ${response.status}: ${errorDetails}`
//       );
//     }

//     const result = await response.json();
//     console.log("Successfully added profile to Klaviyo list:", result);
//   } catch (error) {
//     console.error("Error adding user to Klaviyo list:", error);
//   }
// }

// (async () => {
//   const recipientEmail =  'codelifezu@gmail.com';
//   // const emailSubject = 'Welcome to Our Platform!';
//   // const emailHtmlBody = '<h1>Hi there!</h1><p>Thank you for joining us. We’re excited to have you!</p>';
//   // const emailTextBody = 'Hi there! Thank you for joining us. We’re excited to have you!';

//   try {
//     await registerAddKlaviyo(
//       recipientEmail,
//       "090000",
//       'Zuby',
//       'shuka',
//     );
//     console.log('Email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error.message); 
//   }
// })();



  export default registerAddKlaviyo;