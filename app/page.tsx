"use client";

import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import Image from "next/image";
import Loading from "./loading";
import edit from "/public/edit.png";
import {useRouter} from "next/navigation";
import {TimePicker} from "@mui/x-date-pickers";
import styles from "./styles/Notes.module.scss";
import Navigation from "@/components/navigation";
import autoSizeTextArea from "@/lib/autoSizeTextArea";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Suspense, useEffect, useRef, useState} from "react";
import important_shaded from "/public/important_shaded.png";
import important_unshaded from "/public/important_unshaded.png";
import {dayIsTomorrow, isDueToday, isPastDue} from "@/lib/reminder";
import {getAllNotes, handleDelete, updateImportantNote} from "../lib/noteFunctions";
import {useSession} from "next-auth/react";

export default function ViewLists() {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [isChecked, setChecked] = useState<Boolean>(false);
  const [markedImportant, setImportant] = useState(false);
  const [noteID, setNoteID] = useState("");
  const [alertVisibile, isAlertVisibile] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [valueContents, setValueContents] = useState<{description: string; index: number}>({description: "", index: 0});
  const ref = useRef(new Array());
  const router = useRouter();
  const {data: session, status} = useSession();

  const {data} = useSWR(`${process.env.NEXTAUTH_URL}/api/note/`, getAllNotes);

  if (status == "unauthenticated") {
    router.replace("/login");
    window.location.reload();
  }
  useEffect(() => {
    if (data) {
      setAllNotes(data);
    }
  }, [data]);

  useEffect(() => {
    const importantNoteUpdate = async () => {
      if (noteID && markedImportant) {
        const response = await updateImportantNote(noteID, markedImportant)
          .then((result) => {
            if (result.ok) {
              isAlertVisibile(true);
              setAlertMessage("Note Marked Important");
              setTimeout(() => {
                isAlertVisibile(false);
              }, 950);
            }
          })
          .then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
      }
    };
    importantNoteUpdate();
  }, [markedImportant, noteID]);

  useEffect(() => {
    const deleteNote = async () => {
      if (isChecked && noteID) {
        const res = await handleDelete(noteID)
          .then((result) => {
            if (result.ok) {
              isAlertVisibile(true);
              setAlertMessage("Task Completed");
              setTimeout(() => {
                isAlertVisibile(false);
              }, 800);
            }
            if (!result.ok) {
              return;
            }
          })
          .then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 900);
          });
      }
    };
    deleteNote();
  }, [isChecked, noteID]);

  autoSizeTextArea(ref.current[valueContents.index], valueContents.description);

  const isEditClicked = (id: string) => {
    router.push(`notes/edit_note/${id}`);
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Navigation />
        <main>
          <section className={styles.addTodo_section}>
            {alertVisibile && <div className={styles.alertVisibile}>{alertMessage}</div>}
            {/* {allNotes.length <= 0 && <div className={styles.noNotes}>No Notes Added</div>} */}
            <div>
              {allNotes.map((note, index) => {
                return (
                  <div className={styles.formContainer} key={note._id}>
                    <div className={styles.formCheckBox}>
                      <input
                        name="checkbox"
                        type="checkbox"
                        onChange={(e) => {
                          setChecked(e.target.checked);
                          setNoteID(note._id);
                        }}
                      />
                      <span className={styles.customCheckBox}></span>
                    </div>
                    <form>
                      <div className={styles.formWrapperReadOnly}>
                        {isDueToday(note.reminderDate, note.reminderTime) && <div className={styles.dueToday}> Due Today</div>}
                        {isPastDue(note.reminderDate, note.reminderTime) && <div className={styles.pastDue}>Past Due</div>}
                        {dayIsTomorrow(note.reminderDate) && <div className={styles.dueTomorrow}>Due Tomorrow</div>}
                        {/* Is todolist marked as important */}
                        <div className={styles.topHeader}>
                          {note.markedImportant == false && (
                            <div
                              className={styles.Isimportant}
                              onClick={() => {
                                setNoteID(note._id);
                                setImportant(true);
                              }}
                            >
                              <span>
                                <Image alt="important_unshaded" src={important_unshaded} height={35} width={35}></Image>
                              </span>
                            </div>
                          )}
                          <div>
                            {note.markedImportant && (
                              <>
                                <span>
                                  <Image alt="important_shaded" src={important_shaded} height={35} width={35}></Image>
                                </span>
                              </>
                            )}
                          </div>
                          {/* Edit Button */}
                          <div className={styles.edit_wrapper} onClick={() => isEditClicked(note._id)}>
                            <Image src={edit} alt="edit button" height={30} width={30} title="Edit note" />
                          </div>
                        </div>

                        {/* Form inputs */}
                        <div className={styles.input_text}>
                          <textarea
                            readOnly
                            rows={1}
                            name="description"
                            value={note.description}
                            ref={(e) => {
                              ref.current.push(e);
                            }}
                            onClick={() => setValueContents({description: note.description, index: index})}
                          />
                        </div>
                        <div className={styles.reminderContainer}>
                          <div>
                            <DatePicker
                              name="date"
                              readOnly
                              disabled={!note.reminderDate}
                              slotProps={{
                                openPickerButton: {
                                  color: "primary",
                                },
                              }}
                              label="Reminder Date"
                              disablePast
                              value={note.reminderDate ? dayjs(note.reminderDate) : undefined}
                            />
                          </div>
                          <div>
                            <TimePicker
                              name="time"
                              readOnly
                              disabled={!note.reminderTime}
                              slotProps={{
                                openPickerButton: {
                                  color: "primary",
                                },
                              }}
                              value={note.reminderTime ? dayjs(note.reminderTime) : undefined}
                              label="Reminder Time"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </Suspense>
    </>
  );
}
