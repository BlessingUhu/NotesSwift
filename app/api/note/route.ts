import {NextRequest, NextResponse} from "next/server";
import connectMongoDB from "@/lib/mongoose";
import NoteSchema from "@/models/noteSchema";
import User from "@/models/userSchema";
import {currentUser} from "@/lib/noteFunctions";

export async function POST(req: NextRequest) {
  const {description, repeat, reminderDate, reminderTime, repeatEndDate, markedImportant} = await req.json();
  const email = await currentUser();
  try {
    await connectMongoDB();
    const user = await User.findOne({email: email});

    if (user) {
      const data = {
        userID: user._id,
        description: description,
        markedImportant: markedImportant,
        repeat: repeat,
        reminderDate: reminderDate,
        reminderTime: reminderTime,
        repeatEndDate: repeatEndDate,
      };
      const createNote = await NoteSchema.create(data);
      createNote.save();

      return NextResponse.json({success: "Note added successfully"}, {status: 201});
    } else {
      return NextResponse.json({error: "User does not exist, error finding user"}, {status: 404});
    }
  } catch (error) {
    return NextResponse.json({error: "Error occurred with the server. " + error}, {status: 500});
  }
}

export async function GET() {
  const email = await currentUser();
  try {
    await connectMongoDB();
    const user = await User.findOne({email: email});
    if (user) {
      const allNotes = await NoteSchema.find({userID: user._id}).sort({reminderDate: 'asc'});
      return NextResponse.json({allNotes}, {status: 201});
    }
    return NextResponse.json({error: "User does not exist, error finding user"}, {status: 404});
  } catch (error) {
    return NextResponse.json({error: "Error occurred with the server. " + error}, {status: 500});
  }
}



export async function PUT(req: NextRequest) {
  const email = await currentUser();
  const {noteID, description, repeat, reminderDate, reminderTime, repeatEndDate, markedImportant} = await req.json();

  try {
    await connectMongoDB();
    const user = await User.findOne({email: email});
    if (user) {
      const note = await NoteSchema.findOne({
        _id: noteID,
        userID: user._id,
      }).updateOne({
        description: description,
        repeat: repeat,
        reminderDate: reminderDate,
        reminderTime: reminderTime,
        repeatEndDate: repeatEndDate,
        markedImportant: markedImportant,
      });
      if (note.acknowledged) {
        return NextResponse.json({success: "Note updated successfully"}, {status: 201});
      } else {
        return NextResponse.json({error: "Note updated successfully"}, {status: 401});
      }
    }
    return NextResponse.json({error: "User does not exist, error finding user"}, {status: 404});
  } catch (error) {
    return NextResponse.json({error: "Error occurred with the server. " + error}, {status: 500});
  }
}

export async function DELETE(req: NextRequest) {
  const {noteID} = await req.json();
  const email = await currentUser();
  try {
    await connectMongoDB();

    const user = await User.findOne({email: email});

    if (user) {
      const note = await NoteSchema.deleteOne({userID: user._id, _id: noteID});
      return NextResponse.json({success: "Note successfully deleted."}, {status: 201});
    }
  } catch (error) {}
}
