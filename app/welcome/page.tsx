import Link from "next/link";
import styles from "../styles/Welcome.module.scss";
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth";
import Image from "next/image";
import logo from "/public/logo.png";
import { authOptions } from "@/lib/authOptions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <>
      <main className={styles.main_container}>
        <div className={styles.padding_container}>
          <section className={styles.logo_section}>
            <div className={styles.logo_container}>
              <div>
                <Image priority={true} src={logo} height={300} width={300} alt={"Logo"}></Image>
              </div>
            </div>
          </section>
          <section className={styles.account_section}>
            <div className={styles.account_container}>
              <h1 className={styles.web_account}>NoteSwift</h1>
              <Link href="/login">
                <button className={styles.login}>Log in</button>
              </Link>
              <p>-------------------OR-------------------</p>

              <Link href="/register">
                <button className={styles.create_account}>Create Account</button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
