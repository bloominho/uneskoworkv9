// Functions related to counting

export const get_count = (question_list, status, uid = undefined) => {
  let count = 0;
  question_list.forEach((question) => {
    if (uid == undefined) {
      if (question.status == status) {
        count++;
      }
    } else {
      if (question.status == status && question.by == uid) {
        count++;
      }
    }
  });
  return count;
};
