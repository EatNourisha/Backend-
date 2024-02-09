import cron from 'node-cron';
import { sendDailyEmail } from './promo.service';
import { customer } from '../../models/index';

async function startPromoCronJob() {
  try {
    
    const customers = await customer.find({});

    cron.schedule('*/2 * * * *', () => {
        customers.forEach((userEmail) => {
        sendDailyEmail(userEmail.email);
      });
      console.log('Running a task every ten minutes');
    });
  } catch (error) {
    console.error('Error fetching customer data:', error);
  }
}

export default startPromoCronJob;
