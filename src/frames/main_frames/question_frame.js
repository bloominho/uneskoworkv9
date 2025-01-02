import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import QuestionList from "./question_list";
import QuestionView from "./question_view";
import QuestionStatus from "./question_status";

function QuestionFrame(props) {
  /** Pages------------------
   * 	page (number)
   *      0: Question List
   *      1: Current Question
   * ------------------------- */
  const [page, set_page] = useState(0);
  const [loading, set_loading] = useState(true);
  const [current_answering, set_current_answering] = useState(null);

  useEffect(() => {
    // 0. Initial Loading
    /** 1. Check If answering any questions */
    const user_answering_questions_ref = query(
      collection(props.data_package.db, "QuestionsV2"),
      where("status", "==", 1),
      where("by", "==", props.data_package.user.uid),
      orderBy("creationTimestamp", "asc"),
      limit(1)
    );

    const user_answering_question_snapshot = onSnapshot(
      user_answering_questions_ref,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          // USER IS NOT ANSWERING ANY QUESTIONS -> Show list
          set_page(0);
          set_current_answering(null);
          set_loading(false);
        } else {
          querySnapshot.forEach((q) => {
            set_page(1);
            set_current_answering(q.data());
            set_loading(false);
          });
        }
      }
    );
    return () => {
      user_answering_question_snapshot();
    };
  }, []);

  if (loading) {
    return <h1>LOADING</h1>;
  } else if (page == 0) {
    // question list
    return (
      <>
        <QuestionStatus data_package={props.data_package} />
        <QuestionList
          data_package={props.data_package}
          set_loading={set_loading}
        />
      </>
    );
  } else if (page == 1) {
    // current question
    return (
      <>
        <QuestionStatus data_package={props.data_package} />
        <QuestionView
          data_package={props.data_package}
          question={current_answering}
          set_loading={set_loading}
        />
      </>
    );
  }
}

export default QuestionFrame;
