"use client";
import Navigation from "@/components/navigation";
import {TimePicker} from "@mui/x-date-pickers";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import styles from "/app/styles/Notes.module.scss";
import {FormEventHandler, Suspense, useRef, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import dayjs, {Dayjs} from "dayjs";
import utc from "dayjs/plugin/utc";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import {NextResponse} from "next/server";
import {useRouter} from "next/navigation";
import close from "/public/close.png";
import important_unshaded from "/public/important_unshaded.png";
import important_shaded from "/public/important_shaded.png";
import Image from "next/image";
import autoSizeTextArea from "../../../lib/autoSizeTextArea";
import Link from "next/link";
import Loading from "@/app/loading";

export default function AddNote() {
  dayjs.extend(utc);
  dayjs.extend(LocalizedFormat);
  const [description, setDescription] = useState("");
  const [reminderDate, setReminderDate] = useState<Dayjs | null>(null);
  const [reminderTime, setReminderTime] = useState<Dayjs | null>(null);
  const [formSubmitted, isFormSubmitted] = useState(false);
  const [markedImportant, setImportant] = useState(false);
  const [formError, setFormError] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const {data: session, status} = useSession();
  const router = useRouter();

  autoSizeTextArea(ref.current, description);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    //check if user is authorized
    if (status == "unauthenticated") {
      signOut({callbackUrl: "/login"});
    }

    // check if there is a description
    if (!description) {
      setFormError("A note is required *");
      return;
    }

    //call the API
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/note`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({description, reminderDate, reminderTime, markedImportant}),
      });
      //get error and success messages
      const {error, success} = await res.json();
      const status = res.status;

      //If there's a successful api call
      if (success && status == 201 && res.ok) {
        isFormSubmitted(true);
        router.prefetch("/");
        setTimeout(() => {
          isFormSubmitted(false);
        }, 900);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }

      //if there's no sucess in api call
      if (status >= 400 && !res.ok) {
        isFormSubmitted(false);
        setFormError(error);
        return NextResponse.json({error: "Error occurred while adding note"}, {status: 400});
      }
    } catch (error) {
      return NextResponse.json({error: "Server Error " + error}, {status: 500});
    }
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Navigation />
        <section className={styles.addTodo_section}>
          <h1>Add Notes</h1>
          {formSubmitted && <div className={styles.alertVisibile}>Note added successfully</div>}
          <div className={styles.formContainer}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className={styles.formWrapper}>
                <div className={styles.topHeader}>
                  {/* Mark Todo list as important  */}
                  <div
                    className={markedImportant ? styles.Isimportant_no_display : styles.Isimportant}
                    onClick={() => {
                      setImportant(true);
                    }}
                  >
                    <span>
                      <Image alt="important_unshaded" src={important_unshaded} height={35} width={35}></Image>
                    </span>
                  </div>
                  {markedImportant && (
                    <span
                      onClick={() => {
                        setImportant(false);
                      }}
                      className="material-symbols-outlined"
                    >
                      <Image alt="important_shaded" src={important_shaded} height={35} width={35}></Image>
                    </span>
                  )}
                  <div>
                    <Link href={"/"}>
                      <Image src={close} alt="close button" height={35} width={35} />
                    </Link>
                  </div>
                </div>
                {/* Form inputs */}
                <div className={styles.input_text}>
                  <textarea
                    value={description}
                    autoFocus
                    rows={1}
                    wrap="hard"
                    ref={ref}
                    name="description"
                    placeholder="Notes"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  {formError && (
                    <div className={styles.formError}>
                      <small>{formError}</small>
                    </div>
                  )}
                </div>
                <div className={styles.reminderContainer}>
                  <div>
                    <DatePicker
                      slotProps={{
                        openPickerButton: {
                          color: "primary",
                        },
                      }}
                      label="Reminder Date"
                      disablePast
                      value={reminderDate}
                      onChange={(value) => {
                        setReminderDate(value);
                      }}
                    />
                  </div>

                  <div>
                    <TimePicker
                      slotProps={{
                        openPickerButton: {
                          color: "primary",
                        },
                      }}
                      value={reminderTime}
                      onChange={(value) => {
                        setReminderTime(value);
                      }}
                      label="Reminder Time"
                    />
                  </div>
                </div>

                <div className={styles.save_button}>
                  <button disabled={formSubmitted} type="submit">
                    SAVE
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </Suspense>
    </>
  );
}
