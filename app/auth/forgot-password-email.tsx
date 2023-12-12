"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";
import {FormEventHandler, useState} from "react";
import {NextResponse} from "next/server";

export default function EmailPasswordReset() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, isEmailSent] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const validatedEmail = email.toLowerCase();

    if (!validatedEmail) {
      setEmailError("An email is required");
    } else if (!validatedEmail.match(/.+\@.+\..+/)) {
      setEmailError("Invalid email format. Example: email@domain.com");
      return;
    } else setEmailError("");

    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/password_reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: validatedEmail}),
      });

      const user = await response.json();
      console.log(user,response.ok)
      if (user && response.ok) {
        isEmailSent(true);
        return NextResponse.json({success: "Email sent."}, {status: 201});
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
      <section className="accountSection">
        <div className="accountNavBar">
          <Link href={"/welcome"}>
            <Image alt={"Website logo"} src={logo} height={50} width={50} />
          </Link>
        </div>
        <h1>Please enter your email to receive the password reset link</h1>
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

        {emailSent && <div className="emailSent">An email has been sent you to reset your password.</div>}
      </section>
    </>
  );
}
