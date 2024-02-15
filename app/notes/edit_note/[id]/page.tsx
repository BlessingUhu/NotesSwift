"use client";

import dayjs, {Dayjs} from "dayjs";
import {FormEventHandler, useEffect, useRef, useState} from "react";
import utc from "dayjs/plugin/utc";
import styles from "/app/styles/Notes.module.scss";
import Navigation from "@/components/navigation";
import {TimePicker} from "@mui/x-date-pickers";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import {useParams, useRouter} from "next/navigation";
import autoSizeTextArea from "@/lib/autoSizeTextArea";
import {getNote, handleUpdate} from "@/lib/noteFunctions";
import {NextResponse} from "next/server";
import Image from "next/image";
import important_unshaded from "/public/important_unshaded.png";
import important_shaded from "/public/important_shaded.png";
import close from "/public/close.png";
import Link from "next/link";
import useSWR from "swr";

export default function EditNote() {
  dayjs.extend(utc);
  dayjs.extend(LocalizedFormat);
  const [repeat, setRepeat] = useState("Never");
  const [allNotes, setAllNotes] = useState({description: "", reminderDate: undefined, reminderTime: undefined, markedImportant: false});
  const [description, setDescription] = useState("");
  const [reminderDate, setReminderDate] = useState<Dayjs | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState<Dayjs | undefined>(undefined);
  const [formUpdated, setFormUpdated] = useState(false);
  const [markedImportant, setImportant] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [formError, setFormError] = useState("");
  const {id} = useParams();
  const router = useRouter();
  const noteID = id.toString();

  const {data} = useSWR(`${noteID}`, getNote);
  autoSizeTextArea(ref.current, description);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!description) {
      setFormError("A note is required *");
      return;
    }

    try {
      const res = await handleUpdate(noteID, description.trim(), reminderDate, reminderTime, markedImportant);

      if (res?.ok) {
        setFormUpdated(true);
        setTimeout(() => {
          setFormUpdated(false);
        }, 900);
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        throw new Error("An error occurred updating the notes.");
      }
    } catch (error) {
      return NextResponse.json(error);
    }
  };

  useEffect(() => {
    if (data) {
      setAllNotes(data);
      setDescription(data.description);
      setImportant(data.markedImportant);
      setReminderDate(data.reminderDate);
      setReminderTime(data.reminderTime);
    }
  }, [data]);

  return (
    <>
      <Navigation />
      <main>
        <section className={styles.addTodo_section}>
          <h1>Edit Note</h1>
          {formUpdated && <div className={styles.alertVisibile}>Note updated successfully</div>}
          <div>
            <div className={styles.formContainer}>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.formWrapper}>
                  {/* Mark note as important  */}
                  <div className={styles.topHeader}>
                    <div
                      className={allNotes.markedImportant || markedImportant ? styles.Isimportant_no_display : styles.Isimportant}
                      onClick={() => {
                        setImportant(true);
                      }}
                    >
                      <span>
                        <Image alt="important_shaded" src={important_unshaded} height={35} width={35}></Image>
                      </span>
                    </div>
                    <div>
                      {(allNotes.markedImportant || markedImportant) && (
                        <>
                          <span>
                            <Image alt="important_shaded" src={important_shaded} height={35} width={35}></Image>
                          </span>
                        </>
                      )}
                    </div>
                    <div className={styles.close}>
                      <Image src={close} alt="close button" height={35} width={35} onClick={router.back} />
                    </div>
                  </div>
                  {/* Form inputs */}
                  <div className={styles.input_text}>
                    <textarea
                      defaultValue={allNotes.description}
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
                          textField: {
                            color: "primary",
                          },
                          openPickerButton: {
                            color: "primary",
                          },
                        }}
                        label="Reminder Date"
                        disablePast
                        value={dayjs(allNotes.reminderDate) || undefined}
                        onChange={(value) => {
                          setReminderDate(value as Dayjs | undefined);
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
                        value={dayjs(allNotes.reminderTime)}
                        onChange={(value) => {
                          setReminderTime(value as Dayjs | undefined);
                        }}
                        label="Reminder Time"
                      />
                    </div>
                  </div>

                  <div className={styles.save_button}>
                    <button disabled={formUpdated} type="submit">
                      UPDATE
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
