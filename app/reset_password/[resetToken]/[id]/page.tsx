import ForgotPassword from "../../../auth/forgot-password";
import {redirect, useParams} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "../../../api/auth/[...nextauth]/route";
import {useRouter} from "next/router";
import connectMongoDB from "@/lib/mongoose";
import Token from "@/models/tokenSchema";
import {compare} from "bcrypt-ts";

export default async function ResetPassword() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return <ForgotPassword />;
}
