"use client";

import dayjs, {Dayjs} from "dayjs";
import tomorrow from "dayjs/plugin/isTomorrow";


export function isPastDue(reminderDate: Dayjs | undefined, reminderTime: Dayjs | undefined) {
  const isDayPast = dayjs().isAfter(reminderDate, "day");
  const isTimeHasPast = isPastTime(reminderTime);
  const isDayToday = dayjs().isSame(reminderDate, "day");

  if (isDayToday && isTimeHasPast) {
    return true;
  }

  return isDayPast;
}

export function isDueToday(reminderDate: Dayjs | undefined, reminderTime: Dayjs | undefined) {
  const isDayToday = dayjs().isSame(reminderDate, "day");
  const isTimeHasPast = !isPastTime(reminderTime);
  return isDayToday && isTimeHasPast;
}

export function dayIsTomorrow(reminderDate: Dayjs | undefined) {
  dayjs.extend(tomorrow);
  return dayjs(reminderDate).isTomorrow();
}

function isPastTime(reminderTime: Dayjs | undefined) {
  if (reminderTime) {
    const currentTime = dayjs();
    const timeToCompare = dayjs(reminderTime).set("year", currentTime.year()).set("month", currentTime.month()).set("date", currentTime.date());
    return currentTime.isAfter(timeToCompare);
  }
  return false;
}
