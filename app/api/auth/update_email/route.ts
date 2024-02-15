import connectMongoDB from "@/lib/mongoose";
import User from "@/models/userSchema";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const {oldEmail, newEmail} = await req.json();

  try {
    await connectMongoDB();
    const user = await User.findOne({email: oldEmail});

    if (!user) {
      return NextResponse.json({error: "Old email address not found. We are unable to update your email address"}, {status: 404});
    }
    if (user.email == newEmail) {
      return NextResponse.json({error: "Please choose a different email address to update. This is your current email address"}, {status: 400});
    }

    await user.updateOne({email: newEmail});
    user.save();
    return NextResponse.json({success: "Email successfully updated"}, {status: 201});
  } catch (error) {
    return NextResponse.json(error, {status: 500});
  }
}
