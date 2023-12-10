"use client";

import {signIn} from "next-auth/react";
import Image from "next/image";
import google_logo from "../public/google_logo.png";

export default function GoogleLogin() {
  return (
    <div className="googleDiv" onClick={() => signIn("google")}>
      {" "}
      <div className="googleImage">
        <Image alt="google icon" src={google_logo} height="40" width="40"></Image>
      </div>
      <div className="googleContent">Login with Google</div>
    </div>
  );
}
