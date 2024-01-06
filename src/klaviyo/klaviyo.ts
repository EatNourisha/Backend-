// import { DocumentType } from "@typegoose/typegoose";
// import { Model } from "mongoose"
import { customer } from '../models/index'; 
import fetch from 'node-fetch';

async function addUserToKlaviyoList(): Promise<void> {
  const listId: string = 'TvnkRj'

  try {
    
    const customers = await customer.find({});
    
    const endpoint: string = `https://a.klaviyo.com/api/v2/list/${listId}/members`;
    const payload = {
      api_key: process.env.klaviyoApiKey,
      profiles: customers.map(({ email, phone }) => ({ email, phone })),
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
    console.error('Error adding users to Klaviyo list:', error);
  }
}


export default addUserToKlaviyoList;