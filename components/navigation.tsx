"use client";

import {signOut} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import logo from "../public/logo.png";
import logout from "../public/logout.png";
import account_logo from "../public/account_logo.png";
import notification from "../public/notification.png";
import add_logo from "../public/add_logo.png";

export default function Welcome() {
  const isActiveLink = (url: string) => {
    const params = usePathname();
    if (params == url) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Top Navigation */}
      <section className="navBar-section">
        <div className="topNavContainter">
          <div className="navBarListsContainer">
            <div className="logo">
              <Link href={"/"}>
                <Image alt="logo" src={logo} width={60} height={60}></Image>
              </Link>
            </div>
            <div className="searchInput">
              <input type="search" placeholder="search..." />
            </div>
          </div>
          <div className="navBarListsContainer2">
            <div className={isActiveLink("/addTodo") ? "navBarlistsActive" : "navBarlists"}>
              <Link href={"/addTodo"}>
                <Image src={add_logo} alt={"add logo"} height={25} width={25}></Image>
              </Link>
            </div>
            <div className={isActiveLink("") ? "navBarlistsActive" : "navBarlists"}>
              <Link href={"/"}>
                <Image src={notification} alt={"notification logo"} height={25} width={25}></Image>
              </Link>
            </div>
            <div className={isActiveLink("") ? "navBarlistsActive" : "navBarlists"}>
              <Link href={"/"}>
                <Image src={account_logo} alt={"account logo"} height={25} width={25}></Image>
              </Link>
            </div>
            <div className="navBarlists">
              <div onClick={() => signOut({callbackUrl: "/welcome"})}>
                <Image src={logout} alt={"logout"} height={25} width={25}></Image>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side Bar Navigation */}
      <section className="sideBar-Section">
        <div className="sideBar-containter">
          <div className="sideBar">
            <div className="sideBar-contents">
              <div className="material-symbols-outlined">inbox</div> <div>Inbox</div>
            </div>
            <div className="sideBar-contents">
              <div className="material-symbols-outlined">calendar_today</div>
              <div>Today</div>
            </div>
            <div className="sideBar-contents">
              <div className="material-symbols-outlined">upcoming</div> <div>Upcoming</div>
            </div>
            <div className="sideBar-contents">
              <div className="material-symbols-outlined">label_important</div>
              <div>Important</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
