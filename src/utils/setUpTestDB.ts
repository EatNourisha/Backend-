import mongoose from "mongoose"
import config from "../config";
const setUpTestDB = ()=>{
    beforeAll(async ()=>{
        await mongoose.connect(config.DB_URI_TEST)
    })
    afterAll(async () => {
        await mongoose.disconnect();
    });

}

export default setUpTestDB;