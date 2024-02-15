"use client";

import {useSession} from "next-auth/react";
import styles from "/app/styles/UpdateUserInfo.module.scss";
import {useRouter} from "next/navigation";
import AccountUpdateNavigation from "@/components/updateUserInfoNav";
import {FormEventHandler, useState} from "react";
import {NextResponse} from "next/server";
import success from "/public/success.png";
import MessageAlert from "@/components/modal";


export default function UpdateName() {
  const {data: session, update: sessionUpdate} = useSession();
  const [newName, setNewName] = useState("");
  const [oldName, setOldName] = useState("");
  const [newNameError, setNewFormError] = useState("");
  const [oldNameError, setOldFormError] = useState("");
  const [nameUpdated, setNameUpdated] = useState(false);
  const [formError, setFormError] = useState("");
  const route = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!newName && !oldName) {
      setFormError("A Name is required");
      return;
    } else {
      setFormError("");
    }

    if (!newName) {
      setNewFormError("A Name is required");
      return;
    } else {
      setNewFormError("");
    }

    if (!oldName) {
      setOldFormError("A Name is required");
      return;
    } else {
      setOldFormError("");
    }

    try {
      

      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/update_name`, {
        method: "POST",
        headers: {Accept: "application/json"},
        body: JSON.stringify({oldName: oldName, newName: newName, email: session?.user?.email}),
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
        setNameUpdated(true);
      }
    } catch (error) {}
  };

  return (
    <>
      {nameUpdated && (
        <MessageAlert
          image={success}
          title="Name Updated"
          message="Your name has been successfully updated"
          nextAction={async () => {
            route.replace("/");
          }}
        />
      )}

      <AccountUpdateNavigation />
      <section className={styles.update_section}>
        <div className={styles.update_title}>
          <h1>Update Name</h1>
        </div>
        <div className={styles.update_form_wrapper}>
          <form className={styles.update_form} noValidate onSubmit={(e) => handleSubmit(e)}>
            <div className={styles.update_form_input}>
              <input name="Name" type="text" placeholder="Old Name" onChange={(e) => setOldName(e.target.value)} />
            </div>
            {oldNameError && <small>{oldNameError}</small>}

            <div className={styles.update_form_input}>
              <input name="Name" type="text" placeholder="Enter new Name" onChange={(e) => setNewName(e.target.value)} />
            </div>
            {newNameError && <small>{newNameError}</small>}
            <div className={styles.update_button}>
              <button type="submit">Update Name</button>
            </div>
            {formError && <small>{formError}</small>}
          </form>
        </div>
      </section>
    </>
  );
}
