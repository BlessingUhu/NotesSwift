import ForgotPassword from "../../../auth/forgot-password";
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "../../../api/auth/[...nextauth]/route";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";

export default async function ResetPassword() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return <ForgotPassword />;
}
