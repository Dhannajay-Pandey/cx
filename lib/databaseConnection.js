import mongoose from "mongoose";

const rawMongoUri = process.env.MONGODB_URI || "";
const MONGODB_URL = rawMongoUri
  .replace(/^MONGODB_URI\s*=/i, "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URI is not set in the environment");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: "ecommerce",
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};