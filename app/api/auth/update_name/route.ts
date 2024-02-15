import connectMongoDB from "@/lib/mongoose";
import User from "@/models/userSchema";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  const {oldName, newName, email} = await req.json();
  try {
    await connectMongoDB();
    const user = await User.findOne({email: email, name: oldName});
    if (!user) {
      return NextResponse.json({error: "The old name entered is not what we have on file"}, {status: 404});
    }
    if (user.name == newName) {
      return NextResponse.json({error: "The name you want to update is thesame as your previous name."}, {status: 400});
    }
    await user.updateOne({name: newName});
    user.save();
    return NextResponse.json({success: "Name successfully updated."}, {status: 201});
  } catch (error) {
    return NextResponse.json(error, {status: 500});
  }
}
