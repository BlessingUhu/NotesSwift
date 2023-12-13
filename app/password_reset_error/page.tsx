import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]/route";
import {redirect} from "next/navigation";
import NoPasswordToken from "../auth/no-token";

export default async function InvalidToken() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return <NoPasswordToken />;
}
