export const number_in_2characters = (idx) => {
  if (idx < 10) {
    return "0" + String(idx);
  } else {
    return String(idx);
  }
};

export const shorten_text = (str, limit = 10) => {
  if (str.trim().length > limit) {
    return str.trim().slice(0, limit) + "...";
  } else {
    return str.trim();
  }
};
