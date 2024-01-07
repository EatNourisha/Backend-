import { customer } from '../models/index';
import fetch from 'node-fetch';

const listId: string = 'TvnkRj';

async function addUserToKlaviyoList(): Promise<void> {
  try {
    const customers = await customer.find({});
    
    const endpoint: string = `https://a.klaviyo.com/api/v2/list/${listId}/members`;
    const apiKey: string | undefined = process.env.klaviyoApiKey;

    const batchSize: number = 100;
    const totalCustomers = customers.length;
    const maxRetries = 3;

    for (let i = 0; i < totalCustomers; i += batchSize) {
      const batch = customers.slice(i, i + batchSize);
      const payload = {
        api_key: apiKey,
        profiles: batch.map(({ email, phone }) => ({ email, phone })),
      };
      
      let retries = 0;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          console.log('Result from Klaviyo:', result);

          success = true; 
        } catch (error) {
          console.error(`Error adding users to Klaviyo list (Batch ${i + 1}-${i + batchSize}):`, error);
          retries++;
          console.log(`Retrying (Attempt ${retries}/${maxRetries})...`);
        }
      }

      if (!success) {
        console.error(`Failed to add users to Klaviyo list after ${maxRetries} attempts (Batch ${i + 1}-${i + batchSize}).`);
       
      }
    }

    console.log('All users added to Klaviyo list successfully.');
  } catch (error) {
    console.error('Error getting users from the database:', error);
  }
}

export default addUserToKlaviyoList;
