"use client";
import Link from "next/link";

import show_password from "public/show_password.png";
import hide_password from "public/hide_password.png";
import Image from "next/image";
import logo from "public/logo.png";
import {useEffect, useState} from "react";
import { useRouter} from "next/router";
import connectMongoDB from "@/lib/mongoose";
import Token from "@/models/tokenSchema";
import {createHash} from "crypto";
import {randomBytes} from "crypto";
import {compare, hash} from "bcrypt-ts";


export default function ForgotPassword() {
  const {resetToken, id} = useRouter().query
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [visible, setVisibility] = useState(true);

  console.log(resetToken, id)

  const handleSubmit = () => {};
  return (
    <>
      <section className="accountSection">
        <div className="accountNavBar">
          <Link href={"/welcome"}>
            <Image alt={"Website logo"} src={logo} height={50} width={50} />
          </Link>
        </div>
        <h1>Reset Password</h1>
        <div className="accountContainer">
          <form noValidate onSubmit={handleSubmit}>
            {/* Email */}
            <div className="formInput">
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={visible ? "password" : "text"}
                name="password"
                placeholder="Password"
              />
              <div className="passwordVisibility" onClick={() => setVisibility(!visible)}>
                <Image alt="hide password" src={visible ? hide_password : show_password} width={25} height={25}></Image>
              </div>
              {passwordError && (
                <div className="error">
                  <small>{passwordError}</small>
                </div>
              )}{" "}
            </div>
            {/* Button */}
            <div className="formInput">
              <button type="submit">Update Password</button>
            </div>
            <div className="accountAlready">
              <p>
                Back to
                <span>
                  <Link href="/login"> Login</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

// const validToken = function () {
//   const {resetToken, id} = useParams();
//   useEffect(() => {
//     const valid = async () => {
//       await connectMongoDB();

//       const token = await Token.findOne({userID: id});
//       const validToken = await compare(resetToken, token?.token);

//       if (validToken) {
//         return true;
//       }
//       return false;
//     };
//   }, [resetToken, id]);
// };
