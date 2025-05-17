import { mongoose } from "mongoose";

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to mongodb successfully");
    } catch (err) {
        console.log("Error connecting to mongodb ",err);
    }
}
export default connectDB;