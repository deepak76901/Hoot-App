import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database connected already");
    return;
  }

  try {
    const db = await mongoose.connect(`${process.env.LOCAL_MONGODB}`);

    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error)
  }
}

export default connectDB;
