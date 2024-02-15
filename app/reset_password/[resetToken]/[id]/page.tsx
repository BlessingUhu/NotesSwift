import ForgotPassword from "../../../auth/forgot-password";
import {redirect, useParams} from "next/navigation";
import {getServerSession} from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function ResetPassword() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return <ForgotPassword />;
}
