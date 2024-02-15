import connectMongoDB from "@/lib/mongoose";
import Token from "@/models/tokenSchema";
import {compare, hash} from "bcrypt-ts";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import {NextRequest, NextResponse} from "next/server";

export const POST = async function (req: NextRequest) {
  try {
    await connectMongoDB();
    const {id, resetToken} = await req.json();
    const token = await Token.findOne({userID: id});

    if (token) {
      const validToken = await compare(resetToken, token.token);
      if (validToken) {
        return NextResponse.json("Token is valid", {status: 201});
      } else {
        NextResponse.json("Token is expired", {status: 400});
      }
    }
    // console.log(token)

    return NextResponse.json("No token available for this user. Token is expired", {status: 404});
  } catch (error) {
    return NextResponse.json({message: error}, {status: 500});
  }
};
