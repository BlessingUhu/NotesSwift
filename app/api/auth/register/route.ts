import User from "@/models/userSchema";
import {NextRequest, NextResponse} from "next/server";
import {hash} from "bcrypt-ts";
import connectMongoDB from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    const {name, email, password} = await req.json();
    const hashedPassword = (await hash(password, 10)).toString();
    await User.create({name, email, password: hashedPassword});

    return NextResponse.json({success: "User created"}, {status: 201});
  } catch (error) {
    return NextResponse.json({message: "Error occured while creating user: " + error}, {status: 500});
  }
}
