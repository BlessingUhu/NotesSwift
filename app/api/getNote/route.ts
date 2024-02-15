import connectMongoDB from "@/lib/mongoose";
import {currentUser} from "@/lib/noteFunctions";
import NoteSchema from "@/models/noteSchema";
import User from "@/models/userSchema";
import {NextRequest, NextResponse} from "next/server";

//GET SPECIFIC NOTE ID

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const email = await currentUser();

  try {
    await connectMongoDB();
    const user = await User.findOne({email: email});
    if (user) {
      const oneNote = await NoteSchema.findOne({userID: user._id, _id: id});
      if (oneNote) {
        return NextResponse.json({oneNote}, {status: 201});
      } else {
        return NextResponse.json({error: "Note not found"}, {status: 404});
      }
    }
    return NextResponse.json({error: "User does not exist, error finding user"}, {status: 404});
  } catch (error) {
    return NextResponse.json({error: "Error occurred with the server. " + error}, {status: 500});
  }
}
