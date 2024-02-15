import Link from "next/link";
import Image from "next/image";
import info from "/public/info.png";
import logo from "/public/logo.png";
import not_found from "/public/not_found.png";

export default function NoPasswordToken() {
  return (
    <section className="errorSection">
      <div className="logoWrapper">
        <Link href={"/welcome"}>
          <Image alt={"Website logo"} src={logo} height={50} width={50} />
        </Link>
      </div>
      <div className="errorWrapper">
        <h1>Token not found or expired.</h1>
        <div className="infoMessage">
          <small>
            <div>
              <Image alt={"info icon"} src={info} height={20} width={20}></Image>
            </div>
            <div>The password link expires after 1 hour.</div>
          </small>
        </div>
        <div>
          {" "}
          <Image priority={true} alt={"Website logo"} src={not_found} height={200} width={200} />
        </div>
      </div>
      <p className="backToHome">
        Back to <Link href={"/welcome"}>Home Page</Link>{" "}
      </p>
    </section>
  );
}
