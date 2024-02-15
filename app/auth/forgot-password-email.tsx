"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";
import success from "/public/success.png";
import {FormEventHandler, useState} from "react";
import {NextResponse} from "next/server";
import MessageAlert from "@/components/modal";


export default function EmailPasswordReset() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, isEmailSent] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const validatedEmail = email.toLowerCase();

    if (!validatedEmail) {
      setEmailError("An email is required");
      return;
    } else if (!validatedEmail.match(/.+\@.+\..+/)) {
      setEmailError("Invalid email format. Example: email@domain.com");
      return;
    } else setEmailError("");

    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send_password_reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: validatedEmail}),
      });

      const user = await response.json();
      if (user && response.ok) {
        isEmailSent(true);
      } else {
        setEmailError("That email address does not exist in our system.");
        isEmailSent(false);
        return NextResponse.json({error: "Email does not exist"}, {status: 401});
      }
    } catch (error) {
      return NextResponse.json(error);
    }
  };

  return (
    <>
      {emailSent && (
        <MessageAlert
          image={success}
          title="Password Link Sent To Email"
          message="An email has been sent to you to reset your password."
          nextAction={() => {
            window.location.reload();
          }}
        />
      )}
      <section className="accountSection">
        <div className="accountNavBar">
          <Link href={"/welcome"}>
            <Image alt={"Website logo"} src={logo} height={50} width={50} />
          </Link>
        </div>
        <h1>Enter email to receive the password reset link</h1>
        <div className="accountContainer">
          <form noValidate onSubmit={handleSubmit}>
            {/* Email */}
            <div className="formInput">
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                name="email"
                placeholder="Email"
              />
              {emailError && (
                <div className="error">
                  <small>{emailError}</small>
                </div>
              )}{" "}
            </div>
            {/* Button */}
            <div className="formInput">
              <button type="submit">Send Password Reset</button>
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
