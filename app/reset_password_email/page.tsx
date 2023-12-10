import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EmailPasswordReset from "../auth/forgot-password-email";

export default async function ResetPassword() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return <EmailPasswordReset />;
}
