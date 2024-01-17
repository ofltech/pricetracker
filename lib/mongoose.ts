import mongoose from 'mongoose';

// Variable to track the connection status.
let isConnected = false;

export const connectToDB = async () => {
    // Set mongoose strict query mode to prevent unknown field queries.
    mongoose.set('strictQuery', true);

    // Check if the MongoDB URI is defined.
    if (!process.env.MONGODB_URI) {
        return console.log('MONGODB_URI is not defined.');
    }

    // Check if the is already a connection to the MongoDB database.
    if (isConnected) {
        return console.log('=> using existing database connection.');
    }

    // Try to connect to MongoDB database and update isConnected on success.
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;

        console.log('MongoDB Connected.');
    } catch (error) {
        console.log(error)
    }
}
