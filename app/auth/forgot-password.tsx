"use client";
import Link from "next/link";

import show_password from "public/show_password.png";
import hide_password from "public/hide_password.png";
import Image from "next/image";
import logo from "public/logo.png";
import {useState} from "react";
import {useParams} from "next/navigation";
import connectMongoDB from "@/lib/mongoose";
import Token from "@/models/tokenSchema";
import {createHash} from "crypto";

export default function ForgotPassword() {
  // const param = useParams();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [visible, setVisibility] = useState(true);

  // await connectMongoDB();

  // // if(!token){
  // //   console.log("no token")
  // // }
  // const hashed = createHash("sha256").update(param.resetToken).digest("hex");
  //   const token = await Token.findOne({token: hashed});

  // console.log( param.resetToken, hashed);

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

// const validToken = async function () {
//   const param = useParams()
//   await connectMongoDB();
//   const token = Token.findOne({token: param.resetToken})
//   console.log(param)

//   if(param.resetToken){

//   }
// };
