"use client";
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";
import styles from "../app/styles/UpdateUserInfo.module.scss";
import {usePathname, useRouter} from "next/navigation";
import previous from "/public/previous.png";
import Image from "next/image";

export default function AccountUpdateNavigation() {
  const route = useRouter();
  const pathname = usePathname();
  const {data: session} = useSession();

  const isLinkActive = (href: string) => {
    if (href == pathname) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <Link href={"/"}>
        <div className={styles.previous}>
          <div>
            <Image alt={"previous"} src={previous} height={25} width={25}></Image>
          </div>
          <div>Go home</div>
        </div>
      </Link>
      <section className={styles.account_section}>
        <div className={styles.account_name}>
          <h1>Welcome, {session?.user?.name}</h1>
        </div>
        <div className={styles.account_nav_wrapper}>
          <div className={isLinkActive("/account/update_name") ? styles.account_nav_listsACTIVE : styles.account_nav_lists}>
            <Link href={"/account/update_name"}>Update Name</Link>
          </div>
          <div className={isLinkActive("/account/update_email") ? styles.account_nav_listsACTIVE : styles.account_nav_lists}>
            <Link href={"/account/update_email"}>Update Email</Link>
          </div>
          <div className={isLinkActive("/account/update_password") ? styles.account_nav_listsACTIVE : styles.account_nav_lists}>
            <a
              onClick={() => {
                signOut({callbackUrl: "/reset_password_email"});
              }}
            >
              Update Password
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
