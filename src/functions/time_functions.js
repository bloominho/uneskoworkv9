// Functions related to time
// Especially, functions returning time strings

export const get_short_date_string = (date) => {
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
};

export const get_short_date_time_string = (date) => {
  return date.getMonth() + 1 + "월 " + date.getDate() + "일";
};

export const get_date_string = (date, character = null) => {
  if (character == null) {
    return (
      date.getFullYear() +
      "년 " +
      (date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 "
    );
  } else {
    return (
      date.getFullYear() +
      character +
      (date.getMonth() + 1) +
      character +
      date.getDate()
    );
  }
};

export const get_date_time_string = (date) => {
  return (
    date.getFullYear() +
    "년 " +
    (date.getMonth() + 1) +
    "월 " +
    date.getDate() +
    "일 " +
    date.getHours() +
    "시 " +
    date.getMinutes() +
    "분"
  );
};

export const get_time_string = (date) => {
  return date.getMonth() + 1 + ":" + date.getDate();
};

// Return Date object of today (at 9AM for firebase compatabilty)
export const get_today_date = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9);
};

// Return Date object of today
//		- BUT, if <4AM, return yesterday's date
export const get_today_date_4AM = () => {
  const today = new Date();
  if (today.getHours() < 4) {
    today.setDate(today.getDate() - 1);
  }
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9);
};
