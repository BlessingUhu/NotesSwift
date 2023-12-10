import connectMongoDB from "@/lib/mongoose";
import User from "@/models/userSchema";
import {NextRequest, NextResponse} from "next/server";




export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    
    const {email} = await req.json();
    const user = await User.findOne({email}).select("_id");
    return NextResponse.json({user}, {status:201});
  } catch (error) {
    return NextResponse.json({error: "Error occured with email: " + error}, {status: 404});
  }
}



