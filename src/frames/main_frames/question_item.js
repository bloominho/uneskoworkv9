import { doc, serverTimestamp, runTransaction } from "firebase/firestore";
import { useState } from "react";
import {
  number_in_2characters,
  shorten_text,
} from "../../functions/numbers_and_texts";

import { get_date_string } from "../../functions/time_functions";

function QuestionItem(props) {
  /** States ------------------------------------------------------------------------
   *    - hover (boolean): Whether the cursor is on this item
   */
  const [hover, set_hover] = useState(false);

  //--- FUNCTION ---------------------------------------------------------
  const start_answering = async () => {
    props.set_loading(true);
    const question_ref = doc(
      props.data_package.db,
      "QuestionsV2",
      String(props.question.id)
    );

    try {
      /**
       * First, Check if the question is still waiting
       * Then, IF the question is still waiting, start answering
       */
      await runTransaction(props.data_package.db, async (transaction) => {
        const questionDoc = await transaction.get(question_ref);
        if (questionDoc.data().status == 0) {
          transaction.update(question_ref, {
            status: 1,
            by: String(props.data_package.user.uid),
            startAnsweringTimestamp: serverTimestamp(),
            updateTimestamp: serverTimestamp(),
          });
        } else {
          props.set_loading(false);
        }
      });
    } catch (e) {
      props.set_loading(false);
    }
  };

  //--- RETURN ---------------------------------------------------------
  if (props.question.valid) {
    if (!hover) {
      /** VALID & NOT HOVER */
      return (
        <>
          <div
            className="my-3"
            onClick={start_answering}
            onMouseEnter={() => {
              set_hover(true);
            }}
          >
            <h5 className="m-0" style={{ lineHeight: 1 }}>
              <span className="title-font" style={{ fontSize: 0.6 + "em" }}>
                {number_in_2characters(props.index)}.
              </span>
              <span
                className="title-font ms-2"
                style={{ color: "rgb(61, 61, 61)" }}
              >
                {shorten_text(props.question.title, 25)}
              </span>
            </h5>
            <span
              className="body-font ms-4"
              style={{ color: "rgb(73, 73, 73)", fontSize: 0.8 + "em" }}
            >
              {props.question.stname} /{" "}
              {get_date_string(props.question.creationTimestamp.toDate(), ".")}
            </span>
          </div>
        </>
      );
    } else {
      /** VALID & HOVER */
      return (
        <>
          <div
            className="my-3"
            onClick={start_answering}
            onMouseLeave={() => {
              set_hover(false);
            }}
            style={{ cursor: "grab", color: "rgb(155, 23, 25)" }}
          >
            <h5 className="m-0" style={{ lineHeight: 1 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-right-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
              </svg>
              <span
                className="title-font ms-2"
                style={{ color: "rgb(197, 5, 8)" }}
              >
                {props.question.title}
              </span>
            </h5>
            <span
              className="body-font ms-4"
              style={{ color: "rgb(73, 73, 73)", fontSize: 0.8 + "em" }}
            >
              {props.question.stname} /{" "}
              {get_date_string(props.question.creationTimestamp.toDate(), ".")}
            </span>
          </div>
        </>
      );
    }
  } else {
    /** UNVALID */
    return (
      <>
        <div
          className="my-3"
          style={{ cursor: "not-allowed", color: "rgb(79, 79, 79)" }}
        >
          <h5 className="m-0" style={{ lineHeight: 1 }}>
            <span className="title-font" style={{ fontSize: 0.6 + "em" }}>
              {number_in_2characters(props.index)}.
            </span>
            <span
              className="title-font ms-2"
              style={{ color: "rgb(144, 144, 144)" }}
            >
              {shorten_text(props.question.title, 25)}
            </span>
          </h5>
          <span
            className="body-font ms-4"
            style={{ color: "rgb(144, 144, 144)", fontSize: 0.8 + "em" }}
          >
            {props.question.stname} /{" "}
            {get_date_string(props.question.creationTimestamp.toDate(), ".")}
          </span>
        </div>
      </>
    );
  }
}

export default QuestionItem;
