import {
  collection,
  limit,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import AdminQuestionItem from "./admin_question_item";

function AdminQuestionFrame(props) {
  const [page, set_page] = useState(0);
  const [question_list, set_question_list] = useState([]);

  /** Initial Download */
  useEffect(() => {
    change_page(false, true);
  }, []);

  /**--- Change Page ------------------------------------------
   * 	if page 0: download latest 11 questions
   * 	if page else: 	UP: download next 10 questions
   * 					DOWN: download previous 10 questions
   */
  const change_page = async (up, init) => {
    let new_list = [];

    let q = undefined;
    if ((init && !up) || ((page == 0 || page == 1) && !up)) {
      // Page 0
      set_page(0);
      q = query(
        collection(props.data_package.db, "QuestionsV2"),
        orderBy("creationTimestamp", "desc"),
        limit(11)
      );
    } else if (init && up) {
      // Update This Page
      q = query(
        collection(props.data_package.db, "QuestionsV2"),
        where("code", "<=", question_list[0].code),
        orderBy("creationTimestamp", "desc"),
        limit(11)
      );
    } else if (up) {
      if (question_list[10] != undefined) {
        // Increase Page
        set_page((old_page) => {
          return old_page + 1;
        });
        q = query(
          collection(props.data_package.db, "QuestionsV2"),
          where("code", "<=", question_list[10].code),
          orderBy("creationTimestamp", "desc"),
          limit(11)
        );
      }
    } else {
      // Decrease Page
      set_page((old_page) => {
        return old_page - 1;
      });
      q = query(
        collection(props.data_package.db, "QuestionsV2"),
        where("code", ">=", question_list[0].code),
        orderBy("creationTimestamp", "asc"),
        limit(11)
      );
    }

    if (q == undefined) {
      return;
    }

    const download = await getDocs(q);
    download.forEach((doc) => {
      new_list.push({
        ...doc.data(),
      });
    });

    new_list.sort((a, b) => {
      return a.code > b.code ? -1 : 1;
    });
    set_question_list(new_list);
  };

  /** Make VIEW */
  const get_question_view = () => {
    let question_view = new Array();
    question_list.forEach((question) => {
      question_view.push(
        <AdminQuestionItem
          key={question.id}
          data_package={props.data_package}
          question={question}
          user_data={props.user_data}
        />
      );
    });
    return question_view.slice(0, 10);
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
          <path
            fill-rule="evenodd"
            d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"
          />
          <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
          <path
            fill-rule="evenodd"
            d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"
          />
        </svg>
        질문 모음
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">질문</th>
            <th scope="col">학생</th>
            <th scope="col">답변자</th>
            <th scope="col">답변 시간</th>
            <th scope="col">상태 변경</th>
          </tr>
        </thead>
        <tbody>{get_question_view()}</tbody>
      </table>
      <h5 className="text-dark-emphasis text-center my-2">
        <span
          className="me-3 dark-hover"
          style={{ cursor: "grab" }}
          onClick={() => {
            change_page(false, false);
          }}
        >
          <span className="material-symbols-outlined inline-icon">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </span>
        </span>

        <span className="me-4" style={{ cursor: "default" }}>
          {page + 1}
        </span>

        <span
          className="me-4 dark-hover"
          style={{ cursor: "grab" }}
          onClick={() => {
            change_page(true, false);
          }}
        >
          <span className="material-symbols-outlined inline-icon">
            arrow_forward_ios
          </span>
        </span>
      </h5>
    </div>
  );
}

export default AdminQuestionFrame;
