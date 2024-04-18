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
    const db = await mongoose.connect(process.env.MONGO_URL || "", {});
    console.log(db);

    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    process.exit(1);
  }
}

export default connectDB;
