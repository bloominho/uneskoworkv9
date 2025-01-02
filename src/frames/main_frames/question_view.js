import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";

import {
  get_date_string,
  get_date_time_string,
} from "../../functions/time_functions";

function QuestionView(props) {
  /** States ------------------------------------------------------------------------
   *    - cancel (boolean): cancel button clicked
   *    - cancel_text (String): cancel reason text
   *    - cancel_valid (boolean): cancel reason text is too short (<5 characters)
   */
  const [cancel, set_cancel] = useState(false);
  const [cancel_text, set_cancel_text] = useState("");
  const [cancel_valid, set_cancel_valid] = useState(true);

  // --- Firebase Reference for this question ------------------------
  const question_ref = doc(
    props.data_package.db,
    "QuestionsV2",
    String(props.question.id)
  );

  // --- Functions to update Firebase --------------------------------
  // ------ 1. Complete ---------------------------
  const answer_complete = async () => {
    /**
     * 1. Update document
     */
    props.set_loading(true);
    await updateDoc(question_ref, {
      status: 2,
      by: String(props.data_package.user.uid),
      completeAnsweringTimestamp: serverTimestamp(),
      updateTimestamp: serverTimestamp(),
    }).catch((e) => {
      props.set_loading(false);
    });
  };

  // ------ 2. Cancel ---------------------------
  const answer_cancel = async () => {
    /**
     * 1. First click: Activate Cancel Textbox
     * 2. Second click: Write to firestore
     *      2.1: Check if text is long enough (>= 5 characters)
     *      2.2: Write to firestore
     */
    if (!cancel) {
      // 1. Activate textbox
      set_cancel(true);
    } else {
      if (cancel_text.trim().length < 5) {
        // 2.1. If length of the reason is too short
        set_cancel_text("");
        set_cancel_valid(false);
      } else {
        // 2.2. Write to firestore db
        props.set_loading(true);

        // Dictionary (for this user)
        var data = new Object();
        data[props.data_package.user.uid] = String(cancel_text.trim());

        // Push the dictionary to canceled arr
        let cancel_list = props.question.canceled.slice();
        cancel_list.push(data);

        // Write at db
        await updateDoc(question_ref, {
          status: 0,
          canceled: cancel_list,
          updateTimestamp: serverTimestamp(),
        }).catch((e) => {
          props.set_loading(false);
        });
      }
    }
  };

  return (
    <>
      <div className="mt-3">
        <div
          className="title-font fs-6 mb-1"
          style={{ color: "rgb(80, 80, 80)", lineHeight: 1 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="16"
            fill="currentColor"
            className="bi bi-pencil-fill me-1"
            viewBox="0 0 16 18"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
          </svg>
          답변중
        </div>
        <div
          className="title-font fs-2 mb-2"
          style={{ color: "rgb(47, 47, 47)", lineHeight: 1 }}
        >
          {props.question.title}
        </div>
        <div className="ms-4">
          <h5 id="loginTitleUp" className="body-font mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23"
              fill="rgb(50, 50, 50)"
              className="bi bi-file-earmark-text-fill me-1"
              viewBox="0 0 15 19"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
            {props.question.stname}
          </h5>
          <h5
            id="loginTitleUp"
            className="body-font mb-2"
            style={{ color: "rgb(50,50,50)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23"
              fill="rgb(50,50,50)"
              className="bi bi-file-earmark-text-fill me-1"
              viewBox="0 0 15 19"
            >
              <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
            {get_date_string(props.question.creationTimestamp.toDate())}
          </h5>
          <h5
            id="loginTitleUp"
            className="body-font mb-2"
            style={{ color: "rgb(50,50,50)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23"
              fill="rgb(50,50,50)"
              className="bi bi-file-earmark-text-fill me-1"
              viewBox="0 0 15 19"
            >
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
            </svg>
            {get_date_time_string(
              props.question.startAnsweringTimestamp.toDate()
            ) + " ~"}
          </h5>
        </div>
      </div>
      <div className="">
        {(() => {
          if (cancel) {
            return (
              <>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    autocomplete="off"
                    placeholder={
                      cancel_valid
                        ? "답변 취소 사유를 입력해주세요."
                        : "5자 이상 입력해주세요."
                    }
                    aria-describedby="basic-addon1"
                    value={cancel_text}
                    onChange={(event) => {
                      set_cancel_text(event.target.value);
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={answer_cancel}
                  >
                    답변 취소
                  </button>
                </div>
              </>
            );
          } else {
            return (
              <button
                type="button"
                className="btn btn-outline-secondary mb-2 float-end px-5"
                style={{ width: "fit-content" }}
                onClick={answer_cancel}
              >
                답변 취소
              </button>
            );
          }
        })()}
      </div>
      <div className="">
        <button
          type="button"
          className="btn btn-outline-success float-end px-5"
          style={{ width: "fit-content" }}
          onClick={answer_complete}
        >
          답변 완료
        </button>
      </div>
    </>
  );
}

export default QuestionView;
