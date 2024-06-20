import { lineup } from "../models"; // Adjust this path as needed
import cron from "node-cron";

cron.schedule('* */1 * * *', async () => {
    // console.log("#########777777 deactivate Job runs every 1 min");

    try {
        const _lineup = await lineup.find({
            status: 'active',
            sub_end_date: {
                $lt: new Date()
            }
        });

        await Promise.all(_lineup.map(async (line: any) => {
            await line.updateOne({ status: 'deactivated' });
        }));
        // console.log("Deactivation process completed successfully.");
    } catch (error) {
        // console.error("An error occurred during deactivation:", error);
    }
}, {
    scheduled: true,
    timezone: "Europe/London"
});

export default cron
