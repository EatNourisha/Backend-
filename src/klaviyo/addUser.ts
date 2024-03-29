 async function registerAddKlaviyo(email: string, phone: string): Promise<void> {
    const listId: string = "VNhLtY"
  
    try {
      const endpoint: string = `https://a.klaviyo.com/api/v2/list/${listId}/members`;
      const payload = {
        api_key: process.env.klaviyoApiKey,
        profiles: [{ email, phone }],
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

  export default registerAddKlaviyo;