"use client";
import Link from "next/link";
import show_password from "/public/show_password.png";
import hide_password from "/public/hide_password.png";
import Image from "next/image";
import logo from "/public/logo.png";
import {useEffect, useState} from "react";
import {redirect, useParams, useRouter} from "next/navigation";
import InvalidToken from "../password_reset_error/page";
import NoPasswordToken from "./no-token";
import {NextResponse} from "next/server";

export default function ForgotPassword() {
  const router = useRouter();
  const {resetToken, id} = useParams();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [visible, setVisibility] = useState(true);

  useEffect(() => {
    const validToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/verify_password`, {
          method: "POST",
          headers: {Accept: "application/json"},
          body: JSON.stringify({resetToken, id}),
        });
        if (!response.ok) {
          return router.push("/password_reset_error");
        }
      } catch (error) {
        return router.push("/password_reset_error");
      }
    };
    validToken();
  }, [resetToken, id]);

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
