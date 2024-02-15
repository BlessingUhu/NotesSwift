import connectMongoDB from "@/lib/mongoose";
import Token from "@/models/tokenSchema";
import User from "@/models/userSchema";
import {compare, hash} from "bcrypt-ts";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const {resetToken, id, password} = await req.json();

    const token = await Token.findOne({userID: id});

    //Checking if there is a token at all for this user
    if (token) {
      const validToken = await compare(resetToken, token.token);

      //Checking if the password token is valid
      if (validToken) {
        const hashedPassword = await hash(password, 10);
        const user = await User.updateOne({_id: id, password: hashedPassword});

        //If there's a password and token, then check if a user exists. Then change password
        if (user) {
          token.deleteOne({userID: id});
          return NextResponse.json("Password successfully changed.", {status: 201});
        } else {
          return NextResponse.json("User was not found", {status: 404});
        }
      }
      return NextResponse.json("Expired reset token.", {status: 400});
    }
    return NextResponse.json("No token was found for this user", {status: 404});
  } catch (error) {
    return NextResponse.json("There was a server error" + error, {status: 500});
  }
}
