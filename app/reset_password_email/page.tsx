import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import EmailPasswordReset from "../auth/forgot-password-email";
import { authOptions } from "@/lib/authOptions";

export default async function ResetPassword() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return <EmailPasswordReset />;
}
