"use client";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png";
import logout from "../public/logout.png";
import account_logo from "../public/account_logo.png";
import notification from "../public/notification.png";
import add_logo from "../public/add_logo.png";
import {Suspense, useEffect, useRef, useState} from "react";
import {getAllNotes} from "@/lib/noteFunctions";
import Loading from "@/app/loading";
import important_unshaded from "/public/important_unshaded.png";
import useSWR, {preload} from "swr";

export default function Navigation() {
  const [isHidden, setHidden] = useState(true);
  const [allImportantNotes, setAllImportantNotes] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const ref_account = useRef<HTMLDivElement | null>(null);

  const {data} = useSWR(`${process.env.NEXTAUTH_URL}/api/note/`, getAllNotes);

  useEffect(() => {
    let count: number = 0;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].markedImportant) {
          count = count + 1;
        }
      }
    }
    setAllImportantNotes(count);
  }, [data]);

  const displayAccount = () => {
    setHidden(!isHidden);
    return isHidden;
  };

  return (
    <>
      {/* Top Navigation */}
      <Suspense fallback={<Loading />}>
        <section className="navBar-section">
          <div className="topNavContainter">
            <div className="navBarListsContainer">
              <div className="logo">
                <Link href={"/"}>
                  <Image priority={true} alt="logo" src={logo} width={60} height={60} title="Website logo"></Image>
                </Link>
              </div>
              <div className="searchInput">
                <input type="search" placeholder="search..." />
              </div>
            </div>
            <div className="navBarListsContainer2">
              <div className={"navBarlists"}>
                <Link href={"/notes/add_note"}>
                  <Image src={add_logo} alt={"add logo"} height={25} width={25} title="Add note"></Image>
                </Link>
              </div>
              <div className={"navBarlists"}>
                <Image src={notification} alt={"notification logo"} height={25} width={25} title="Notifications"></Image>
              </div>
              <div ref={ref_account} onClick={() => displayAccount()} className={"navBarlists"}>
                <Image src={account_logo} alt={"account logo"} height={25} width={25} title="My account"></Image>
              </div>
              <div className={"navBarlists"}>
                <div onClick={() => signOut({callbackUrl: "/welcome"})}>
                  <Image src={logout} alt={"logout"} height={25} width={25} title="Sign out"></Image>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div ref={ref} className={"account_list"} hidden={isHidden}>
          <div>
            <Link href={"account/update_email"}>Update Email</Link>
          </div>
          <div>
            <Link href={"account/update_name"}>Update Name</Link>
          </div>
          <div>
            <a
              onClick={() => {
                signOut({callbackUrl: "/reset_password_email"});
              }}
            >
              Update Password
            </a>
          </div>
        </div>

        {/* Side Bar Navigation */}
        <section className={"sideBar-Section"}>
          <div className="sideBar-containter">
            <div className="sideBar">
              <Link className="sideBar-contents" href={"/"}>
                <div className="sideBar-notes-list">
                  <div className="material-symbols-outlined">lists</div> <div>Notes</div>
                </div>
                <div className="note-count">
                  <span>{data?.length | 0}</span>
                </div>
              </Link>
              <Link className="sideBar-contents" href={""}>
                <div className="sideBar-notes-list">
                  <div className="material-symbols-outlined">calendar_today</div>
                  <div>Today</div>
                </div>
                <div className="note-count">
                  <span>0</span>
                </div>
              </Link>
              <Link className="sideBar-contents" href={""}>
                <div className="sideBar-notes-list">
                  <div className="material-symbols-outlined">upcoming</div> <div>Upcoming</div>
                </div>
                <div className="note-count">
                  <span>0</span>
                </div>
              </Link>
              <Link href={"/notes/important_notes"} className="sideBar-contents">
                <div className="sideBar-notes-list">
                  <div className="material-symbols-outlined">
                    <Image alt="important_unshaded" src={important_unshaded} height={25} width={25}></Image>
                  </div>
                  <div>Important</div>
                </div>
                <div className="note-count">
                  <span>{allImportantNotes}</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </Suspense>
    </>
  );
}
