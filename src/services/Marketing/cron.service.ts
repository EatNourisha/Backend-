import cron from 'node-cron';
import { sendDailyEmail } from './promo.service';
import { customer } from '../../models/index';

async function startPromoCronJob() {
  try {
    
    const customers = await customer.find({});
  
    cron.schedule('0 7 * * 1', () => {
        customers.forEach((userEmail) => {
       
        sendDailyEmail(userEmail.email, userEmail.first_name);
      });
      console.log('Running a task every Monday at 7:00 am');
    });
  } catch (error) {
    console.error('Error fetching customer data:', error);
  }
}

export default startPromoCronJob;