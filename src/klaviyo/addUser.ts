import fetch from 'node-fetch';
 
// async function registerAddKlaviyo(email: string, phone: string, first_name: string, last_name: string): Promise<void> {
//     const listId: string = "VNhLtY"
  
//     try {
//       const endpoint: string = `https://a.klaviyo.com/api/v2/list/${listId}/members`;
//       const payload = {
//         api_key: process.env.klaviyoApiKey,
//         profiles: [{ email, phone, first_name, last_name }],
//       };
  
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });
  
//       const result = await response.json();
//       console.log('Result from Klaviyo:', result);
//     } catch (error) {
//       console.error('Error adding user to Klaviyo list:', error);
//     }
//   }

async function registerAddKlaviyo(first_name: string, last_name: string, email: string, phone: string): Promise<void> {
  const url = `https://a.klaviyo.com/api/profiles`;

  const payload = {
    data: {
      type: "profile",
      attributes: {
          email, 
          phone_number: phone, 
          first_name,
          last_name,
        },
    },
  };

  console.log("Payload:", payload);

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/vnd.api+json',
      revision: '2024-10-15',
      'content-type': 'application/vnd.api+json',
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    console.log("Response:", json);
    if (response.ok) {
      console.log("Profile added successfully!");
    } else {
      console.error("Error:", json);
    }
  } catch (error) {
    console.error("Error while making API request:", error);
  }
}


// async function registerAddKlaviyo(first_name: string, last_name: string, email: string, phone: string, ): Promise<void> {
//   const listId: string = "U65kuQ";
//   const url = `https://a.klaviyo.com/api/lists/${listId}/relationships/profiles`;

//   const data = {
//     data: [
//       {
//         type: "profile",
//         attributes: {
//           email,
//           phone_number: phone,
//           first_name,
//           last_name,
//         },
//       },
//     ],
//   };

//   const options = {
//     method: 'POST',
//     headers: {
//       accept: 'application/vnd.api+json',
//       revision: '2024-10-15',
//       'content-type': 'application/vnd.api+json',
//       Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
//     },
//     body: JSON.stringify(data), 
//   };

//   fetch(url, options)
//     .then((res) => res.json())
//     .then((json) => console.log(json))
//     .catch((err) => console.error(err));
// }


  export default registerAddKlaviyo;