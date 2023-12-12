"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/logo.png";
import {signIn} from "next-auth/react";
import {NextResponse} from "next/server";
import {useRouter} from "next/navigation";
import {FormEventHandler, useState} from "react";
import GoogleLogin from "@/components/googlebutton";
import show_password from "/public/show_password.png";
import hide_password from "/public/hide_password.png";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [visible, setVisibility] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const validatedEmail = email.toLowerCase();

    if (!validatedEmail) {
      setEmailError("An email is required");
    } else if (!validatedEmail.match(/.+\@.+\..+/)) {
      setEmailError("Invalid email. Example: email@domain.com");
      return;
    } else setEmailError("");

    if (!password) {
      setPasswordError("A password is required");
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
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(res)
      if (res?.ok) {
        router.replace("/");
      }
      if (res?.error) {
        setFormError("Invalid Email or Password");
        return NextResponse.json({message: "User entered invalid credentials" + res.error}, {status: res.status});
      }
    } catch (error) {
      return NextResponse.json({message: "Error occurred while trying to login user" + error}, {status: 404});
    }
  };
  const isDisabled = () => {
    if (password == "" && email == "") {
      return true;
    }
    return false;
  };

  return (
    <>
      <section className="accountSection">
        <div className="accountNavBar">
          <Link href={"/welcome"}>
            <Image alt={"Website logo"} src={logo} height={50} width={50} />
          </Link>
        </div>
        <h1>Login</h1>
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
                <Image alt="hide password" src={visible ? hide_password : show_password} width={25} height={25}></Image>
              </div>

              {passwordError && (
                <div className="error">
                  <small>{passwordError}</small>
                </div>
              )}
            </div>

            {/* Button */}
            <div className="formInput">
              <button  type="submit">
                Login
              </button>
            </div>

            {formError && (
              <div className="formInput">
                <div className="error">
                  <small>{formError}</small>
                </div>
              </div>
            )}
            <div className="reset_password">
              <Link href="/reset_password_email">Forgot password</Link>
            </div>
            <div className="accountAlready">
              <p>
                Don't have an account? Please{"  "}
                <span>
                  <Link href="/register">Create an account</Link>
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
