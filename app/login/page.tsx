import Signin from "../auth/signin";
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]/route";

export default async function name() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  return <Signin />;
}
