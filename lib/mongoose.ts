import mongoose from "mongoose";
import {NextResponse} from "next/server";

export default async function connectMongoDB() {
  if (process.env.MONGODB) {
    try {
      await mongoose.connect(process.env.MONGODB);
    } catch (error) {
      return new Error("Database was unable to connect." + error);
    }
  } else {
    return new Error("Database was unable to connect.");
  }
}
