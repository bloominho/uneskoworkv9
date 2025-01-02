import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import QuestionItem from "./question_item";

function QuestionList(props) {
  /** States -------------------------------------------
   *    - question_list (arr): list of questions waiting
   */
  const [question_list, set_question_list] = useState([]);

  // --- Initial Loading -> Turn On Snapshot for Question List
  useEffect(() => {
    async function fetchData() {
      set_question_list([]);
      const waiting_questions_ref = query(
        collection(props.data_package.db, "QuestionsV2"),
        where("status", "==", 0),
        orderBy("creationTimestamp", "asc"),
        orderBy("id", "asc"),
        limit(200)
      ); // Question List Reference

      // First Download
      let list = [];
      const initial_download = await getDocs(waiting_questions_ref);
      initial_download.forEach((doc) => {
        let canceled = false;
        for (let i = 0; i < doc.data().canceled.length; i++) {
          Object.entries(doc.data().canceled[i]).forEach(([key, value]) => {
            if (key == props.data_package.user.uid) {
              canceled = true;
            }
          });
        }

        if (!canceled) {
          list.push({
            ...doc.data(),
            valid: true,
          });
        }

        list.sort((a, b) => {
          return a.creationTimestamp > b.creationTimestamp ? 1 : -1;
        });
        set_question_list(list);
      });

      // For managing modifications:
      const waiting_questions_snapshot = onSnapshot(
        waiting_questions_ref,
        (querySnapshot) => {
          set_question_list((prev_state) => {
            let new_state = prev_state.slice();
            querySnapshot.docChanges().forEach((question_change) => {
              if (
                question_change.type == "added" ||
                question_change.type == "modified"
              ) {
                /** 1. Check if canceled before */
                let canceled = false;
                for (
                  let i = 0;
                  i < question_change.doc.data().canceled.length;
                  i++
                ) {
                  Object.entries(
                    question_change.doc.data().canceled[i]
                  ).forEach(([key, value]) => {
                    if (key == props.data_package.user.uid) {
                      canceled = true;
                    }
                  });
                }

                /** 2. Check if Document Exists in Current List
                 *      if exists: modify
                 *        1) status: waiting && not canceled: valid
                 *        2) status: !waiting || canceled: unvalid
                 */
                let exists = false;
                for (let i = 0; i < new_state.length; i++) {
                  if (new_state[i].id == question_change.doc.data().id) {
                    exists = true;

                    if (question_change.doc.data().status == 0 && !canceled) {
                      new_state[i].valid = true;
                    } else {
                      new_state[i].valid = false;
                    }
                  }
                }

                /** 3. Document is a whole new document:
                 *    add the document to the back of the line
                 */
                if (!exists) {
                  if (question_change.doc.data().status == 0 && !canceled) {
                    new_state.push({
                      ...question_change.doc.data(),
                      valid: true,
                    });
                  }
                }
              } else {
                /** IF DOCUMENT IS REMOVED:
                 *    if the deleted document exists in the list, unvalid
                 */
                for (let i = 0; i < new_state.length; i++) {
                  if (new_state[i].id == question_change.doc.data().id) {
                    new_state[i].valid = false;
                  }
                }
              }
            });
            return new_state;
          });
        },
        (error) => {}
      );
      return () => {
        waiting_questions_snapshot();
      };
    }

    fetchData();
  }, []);

  const get_question_view = () => {
    let question_view = [];
    let i = 1;
    question_list.forEach((question) => {
      question_view.push(
        <QuestionItem
          key={i}
          index={i}
          data_package={props.data_package}
          question={question}
          set_loading={props.set_loading}
        />
      );
      i++;
    });
    return question_view;
  };

  return (
    <div className="mt-3">
      <div className="title-font fs-2" style={{ color: "rgb(47, 47, 47)" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-file-earmark-text-fill me-2"
          viewBox="0 0 18 18"
        >
          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z" />
        </svg>
        답변 대기중인 질문들
      </div>
      {get_question_view()}
    </div>
  );
}

export default QuestionList;
