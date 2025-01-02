import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { shorten_text } from "../../../functions/numbers_and_texts";
import { get_short_date_string } from "../../../functions/time_functions";

function PersonalList(props) {
  /**
   * 	question_list (arr): list of questions to present
   */
  const [question_list, set_question_list] = useState([]);

  /** When Button is Clicked -> Get ten more questions from db */
  const get_ten_more = async () => {
    let ref;

    /**
     * Case 1. question_list is empty: get most recent 10 questions
     * Case 2. question_list is not empty: get 10 more questions starting from the oldest questions
     */
    if (question_list.length == 0) {
      ref = query(
        collection(props.data_package.db, "QuestionsV2"),
        where("by", "==", String(props.data_package.user.uid)),
        where("status", "==", 2),
        orderBy("startAnsweringTimestamp", "desc"),
        limit(10)
      );
    } else {
      ref = query(
        collection(props.data_package.db, "QuestionsV2"),
        where("by", "==", String(props.data_package.user.uid)),
        where("status", "==", 2),
        where(
          "startAnsweringTimestamp",
          "<",
          question_list[question_list.length - 1].startAnsweringTimestamp
        ),
        orderBy("startAnsweringTimestamp", "desc"),
        limit(10)
      );
    }

    const download = await getDocs(ref);

    download.forEach((doc) => {
      set_question_list((prev_state) => {
        let new_state = prev_state.slice();
        new_state.push({
          ...doc.data(),
        });
        return new_state;
      });
    });
  };

  const make_view = () => {
    let list = [];
    question_list.forEach((question) => {
      list.push(
        <tr key={question.id}>
          <td>{shorten_text(question.title, 20)}</td>
          <td>{question.stname}</td>
          <td>
            {get_short_date_string(question.startAnsweringTimestamp.toDate())}
          </td>
          <td>
            {get_short_date_string(
              question.completeAnsweringTimestamp.toDate()
            )}
          </td>
        </tr>
      );
    });
    return list;
  };

  useEffect(() => {
    get_ten_more();
  }, []);

  return (
    <div className="mt-1">
      <div className="title-font fs-2" style={{ color: "rgb(47, 47, 47)" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-file-earmark-text-fill me-2"
          viewBox="0 0 18 18"
        >
          <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
        </svg>
        답변 기록
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">질문</th>
            <th scope="col">학생</th>
            <th scope="col">답변 시작</th>
            <th scope="col">답변 완료</th>
          </tr>
        </thead>
        <tbody>{make_view()}</tbody>
      </table>
      {}
      <div className="d-grid gap-2">
        <button
          type="button"
          className="btn btn-light"
          onClick={() => {
            get_ten_more();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-down-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PersonalList;
