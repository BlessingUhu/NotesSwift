"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";
import {NextResponse} from "next/server";
import success from "/public/success.png";
import {useRouter} from "next/navigation";
import {FormEventHandler, useState} from "react";
import show_password from "/public/show_password.png";
import hide_password from "/public/hide_password.png";
import GoogleLogin from "@/components/googlebutton";
import MessageAlert from "@/components/modal";

export default function CreateNewUser() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [nameError, setNameError] = useState("");
  const [visible, setVisibility] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [accountCreated, isAccountCreated] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    const validatedEmail = email.toLowerCase();
    e.preventDefault();

    if (!name) {
      setNameError("A name is required");
      return;
    } else if (name.match(/\d/)) {
      setNameError("Your name must not contain a number");
      return;
    } else setNameError("");

    if (!validatedEmail) {
      setEmailError("An email is required");
      return;
    } else if (!validatedEmail.match(/.+\@.+\..+/)) {
      setEmailError("Invalid email. Example: email@domain.com");
      return;
    } else setEmailError("");

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
      const existingRes = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/existingemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: validatedEmail}),
      });

      const {user} = await existingRes.json();
      if (user) {
        setFormError("User already exists.");
        return;
      } else {
        setFormError("");
      }

      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email: validatedEmail, password}),
      });

      if (res.ok) {
        isAccountCreated(true);
      } else {
        isAccountCreated(false);
        return NextResponse.json({error: "Error Posting User"}, {status: 400});
      }
    } catch (error) {
      return NextResponse.json({message: "Error with registration: " + error}, {status: 400});
    }
  };

  return (
    <>
      {accountCreated && (
        <MessageAlert
          title="Account Created Successfully"
          message="Thank you for creating an account. Please login with your email and password."
          image={success}
          nextAction={() => {
            router.push("/login");
            return NextResponse.json({success: "Account created."}, {status: 201});
          }}
        />
      )}
      <section className="accountSection">
        <div className="accountNavBar">
          <Link href={"/welcome"}>
            <Image alt={"Website logo"} src={logo} height={50} width={50} />
          </Link>
        </div>
        <h1>Register</h1>
        <div className="accountContainer">
          <form noValidate onSubmit={handleSubmit}>
            {/* Name */}
            <div className="formInput">
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                name="name"
                placeholder="Your name"
              />
              {nameError && (
                <div className="error">
                  <small>{nameError}</small>
                </div>
              )}
            </div>

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
              )}
            </div>

            {/* Password */}
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
                <Image alt="hide password" src={visible ? show_password : hide_password} width={25} height={25}></Image>
              </div>
              {passwordError && (
                <div className="error">
                  <small>{passwordError}</small>
                </div>
              )}
            </div>

            {/* Button */}
            <div className="formInput">
              <button type="submit">Create Account</button>
            </div>

            {formError && (
              <div className="formInput">
                <div className="error">
                  <small>{formError}</small>
                </div>
              </div>
            )}

            <div className="accountAlready">
              <p>
                Already have an account? Please{"  "}
                <span>
                  <Link href="/login">Login</Link>
                </span>
              </p>
              <GoogleLogin />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
