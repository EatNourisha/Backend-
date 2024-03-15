import { mobileUse } from "../models";

export class MobileUseService {
 async saveStringData(data: string | string[]) {
   try {
     if (typeof data === "string") {
        const newString = new mobileUse({ data });
        await newString.save();
     }

     else if (Array.isArray(data)) {
        for (const item of data) {
               const newString = new mobileUse({ data: item });
               await newString.save();
        }
     }

     else{
        throw new Error('Invalid data format. Must be a string or an array of strings.');
     }
   } catch (error) {
    throw new Error('Error saving data: ' + error.message);
   }
 }

 async getStringData() {
    try{
        const string = await mobileUse.find();
        return string;
    } catch (error) {
        throw new Error('Error getting data: ' + error.message);
    }
 }
}