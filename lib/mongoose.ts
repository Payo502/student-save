import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
    mongoose.set("strictQuery", true);

    if(!process.env.MONGODB_URI) {
        return console.log("MONGODB_URI is not set");
    }

    if(isConnected) {
        return console.log("=> using existing database connection");
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB is connected");
    }catch (error) {
        console.log(error);
    }
}