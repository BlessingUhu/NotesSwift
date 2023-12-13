import JWT from "jsonwebtoken";
import User from "@/models/userSchema";
import Token from "@/models/tokenSchema";
import connectMongoDB from "@/lib/mongoose";
import {NextRequest, NextResponse} from "next/server";
import nodemailer from "nodemailer";
import {createHash, randomBytes} from "crypto";
import {genSalt, hash} from "bcrypt-ts";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const {email} = await req.json();
    const user = await User.findOne({email});

    //If user doesn't exist
    if (!user) {
      return NextResponse.json({error: "User does not exist"}, {status: 401});
    }

    const isToken = await Token.findOne({userID: user?._id});
    if (isToken) {
      isToken.deleteOne();
    }

    // Setting up reset token
    // const arraybuffer = new ArrayBuffer(16);
    // const resetToken = crypto.getRandomValues(new Int32Array(arraybuffer))?.toString();
    // const hashedToken = createHash("sha256").update(resetToken).digest("hex");
    const resetToken = randomBytes(16).toString("hex");
    const hashedToken = await hash(resetToken, 10);

    // Saving token to database:
    const token = Token.create({
      userID: user._id,
      token: hashedToken,
      expires: Date.now(),
    });
    (await token).save();

    // Handling sending password reset email
    const emailTransporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const message = {
      from: "Blessing2002.feb@icloud.com",
      to: "Blessing2002.feb@gmail.com",
      subject: "Password Reset",
      text: "Please link on the link to reset your password",
      html: `${process.env.NEXTAUTH_URL}/reset_password/${resetToken}/${user._id}`,
    };

    emailTransporter.sendMail(message, function (error, info) {
      if (error) {
        return NextResponse.json({message: "Email not sent. Issue with email server " + error}, {status: 400});
      }
    });

    return NextResponse.json({message: "Email sent sucessfully."}, {status: 200});
  } catch (error) {
    return NextResponse.json(error, {status: 500});
  }
}
