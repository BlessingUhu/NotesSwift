import CreateNewUser from "../auth/register";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

 export default async function Register() {
  const session = await getServerSession(authOptions);
  if (session)(
    redirect("/")
  )
  return <CreateNewUser />;
}
 