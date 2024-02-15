"use client";
import Link from "next/link";
import show_password from "/public/show_password.png";
import hide_password from "/public/hide_password.png";
import Image from "next/image";
import logo from "/public/logo.png";
import success from "/public/success.png";
import {FormEventHandler, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {NextResponse} from "next/server";
import MessageAlert from "@/components/modal";

export default function ForgotPassword() {
  const router = useRouter();
  const {resetToken, id} = useParams();
  const [passwordChanged, isPasswordChanged] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [visible, setVisibility] = useState(true);

  useEffect(() => {
    const validToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/verify_token`, {
          method: "POST",
          headers: {Accept: "application/json"},
          body: JSON.stringify({resetToken, id}),
        });
        if (!response.ok) {
          return router.replace("/password_reset_error");
        }
      } catch (error) {
        return router.replace("/password_reset_error");
      }
    };
    validToken();
  }, [resetToken, id, router]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!password) {
      setPasswordError("A password is required");
      return;
    } else if (!password.match(/\d/)) {
      setPasswordError("Password must contain least one digit");
      return;
    } else if (!password.match(/[a-z]/)) {
      setPasswordError("Password must at least one lowercase");
      return;
    } else if (!password.match(/[A-Z]/)) {
      setPasswordError("Password must contain at least one Uppercase");
      return;
    } else if (!password.match(/[!@#$%^&?~*]/)) {
      setPasswordError("Password must contain at least on symbol");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password must be 8 characters long");
      return;
    } else setPasswordError("");
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/reset_password`, {
        method: "POST",
        headers: {Accept: "Application/json"},
        body: JSON.stringify({resetToken, id, password}),
      });
      const user = await res.json();
      if (user && res.ok) {
        isPasswordChanged(true);
      } else {
        isPasswordChanged(false);
        return NextResponse.json("Password could not be changed", {status: res.status});
      }
    } catch (error) {
      return NextResponse.json(error, {status: 500});
    }
  };

  return (
    <>
      {passwordChanged && (
        <MessageAlert
          title="Password Changed Successfully"
          message="Your password has been changed successfully. You are now being redirected to the login page."
          image={success}
          nextAction={() => {
            router.replace("/login");
            return NextResponse.json({success: "Password changed."}, {status: 201});
          }}
        />
      )}
      <section className="accountSection">
        <div className="accountNavBar">
          <Link href={"/welcome"}>
            <Image alt={"Website logo"} src={logo} height={50} width={50} />
          </Link>
        </div>
        <h1>Reset Password</h1>
        <div className="accountContainer">
          <form noValidate onSubmit={handleSubmit}>
            {/* Password */}
            <div className="formInput">
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={visible ? "password" : "text"}
                name="password"
                placeholder="New Password"
              />
              <div className="passwordVisibility" onClick={() => setVisibility(!visible)}>
                <Image alt="hide password" src={visible ? show_password : hide_password} width={25} height={25}></Image>
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
