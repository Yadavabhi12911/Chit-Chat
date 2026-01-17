import { configDotenv } from "dotenv";
configDotenv()

import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const instance = await mongoose.connect(process.env.MONGO_URI)

        console.log(` database connetd ${instance.connection.host}`);

    } catch (error) {
        console.log("err while connecting to db ", error.message);
        process.exit(1)
    }
}


export default connectDb