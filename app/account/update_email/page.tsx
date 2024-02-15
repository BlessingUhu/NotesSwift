"use client";

import {useSession} from "next-auth/react";
import styles from "/app/styles/UpdateUserInfo.module.scss";
import {useRouter} from "next/navigation";
import AccountUpdateNavigation from "@/components/updateUserInfoNav";
import {FormEventHandler, useState} from "react";
import {NextResponse} from "next/server";
import success from "/public/success.png";
import MessageAlert from "@/components/modal";

export default function UpdateEmail() {
  const {data: session, update: sessionUpdate} = useSession();
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmailError, setNewFormError] = useState("");
  const [oldEmailError, setOldFormError] = useState("");
  const [emailUpdatd, setEmailUpdated] = useState(false);
  const [formError, setFormError] = useState("");
  const route = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const newValidatedEmail = newEmail.toLowerCase();
    const oldValidatedEmail = oldEmail.toLowerCase();

    if (!newValidatedEmail && !oldValidatedEmail) {
      setFormError("An email is required");
      return;
    } else {
      setFormError("");
    }
    if (!newValidatedEmail) {
      setNewFormError("An email is required");
      return;
    } else if (!newValidatedEmail.match(/.+\@.+\..+/)) {
      setNewFormError("Invalid email format. Example: email@domain.com");
      return;
    } else setNewFormError("");

    if (!oldValidatedEmail) {
      setNewFormError("An email is required");
      return;
    } else if (!oldValidatedEmail.match(/.+\@.+\..+/)) {
      setOldFormError("Invalid email format. Example: email@domain.com");
      return;
    } else setOldFormError("");

    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/update_email`, {
        method: "POST",
        headers: {Accept: "application/json"},
        body: JSON.stringify({oldEmail: oldValidatedEmail, newEmail: newValidatedEmail}),
      });
      const {error} = await response.json();
      const status = await response.status;

      if (status == 400) {
        setNewFormError(error);
        return NextResponse.json(error);
      }
      if (status == 404) {
        setFormError(error);
        return NextResponse.json(error);
      }
      if (status == 201) {
        setEmailUpdated(true);
      }
    } catch (error) {}
  };

  return (
    <>
      {emailUpdatd && (
        <MessageAlert
          image={success}
          title="Email Updated"
          message="Your Email has been successfully updated"
          nextAction={ () => {
             sessionUpdate();
            route.replace("/");
          }}
        />
      )}

      <AccountUpdateNavigation />
      <section className={styles.update_section}>
        <div className={styles.update_title}>
          <h1>Update Email Address</h1>
        </div>
        <div className={styles.update_form_wrapper}>
          <form className={styles.update_form} noValidate onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.update_form_input}>
              <input name="email" type="email" placeholder="Old email" onChange={(e) => setOldEmail(e.target.value)} />
            </div>
            {oldEmailError && <small>{oldEmailError}</small>}

            <div className={styles.update_form_input}>
              <input name="email" type="email" placeholder="Enter new email" onChange={(e) => setNewEmail(e.target.value)} />
            </div>
            {newEmailError && <small>{newEmailError}</small>}
            <div className={styles.update_button}>
              <button type="submit">Update Email</button>
            </div>
            {formError && <small>{formError}</small>}
          </form>
        </div>
      </section>
    </>
  );
}
