import {Dayjs} from "dayjs";
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import { authOptions } from "./authOptions";

export async function getAllNotes() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/note/`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      next: {revalidate: 1},
    });
    if (!response.ok) {
      const error = new Error("Error retrieving notes");
      throw error;
    } else {
      const {allNotes} = await response.json();
      return allNotes;
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function getNote(id: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/getNote/?id=${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      next: {revalidate: 1},
    });
    if (!response.ok) {
      const error = new Error("Error retrieving note");
      throw error;
    } else {
      const {oneNote} = await response.json();
      return oneNote;
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function handleUpdate(noteID: string, description: string, reminderDate: Dayjs | undefined, reminderTime: Dayjs | undefined, markedImportant: boolean) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/note`, {
      method: "PUT",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({noteID, description, reminderDate, reminderTime, markedImportant}),
      next: {revalidate: 1},
    });
    return response;
  } catch (error) {}
}

export async function handleDelete(noteID: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/note/`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({noteID}),
      next: {revalidate: 1},
    });
    return response;
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function updateImportantNote(noteID: string, markedImportant: boolean) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/note/`, {
      method: "PUT",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({noteID, markedImportant}),
      next: {revalidate: 1},
    });
    return response;
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function currentUser() {
  const session = await getServerSession(authOptions);
  return session?.user?.email?.toLowerCase();
}
