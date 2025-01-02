import AdminUserName from "./admin_user_name";
import { shorten_text } from "../../../functions/numbers_and_texts";
import { get_short_date_string } from "../../../functions/time_functions";

import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

function AdminQuestionItem(props) {
  const [loading, set_loading] = useState(false);
  const [updated_status, set_updated_status] = useState(null);

  const change_status = async () => {
    set_loading(true);
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
        if (questionDoc.data().status == 0 || questionDoc.data().status == 1) {
          transaction.update(question_ref, {
            status: 2,
            by: String(props.data_package.user.uid),
            startAnsweringTimestamp: serverTimestamp(),
            completeAnsweringTimestamp: serverTimestamp(),
            updateTimestamp: serverTimestamp(),
          });
          set_updated_status(2);
        } else {
          transaction.update(question_ref, {
            status: 0,
            updateTimestamp: serverTimestamp(),
          });
          set_updated_status(0);
        }
        set_loading(false);
      });
    } catch (e) {
      set_loading(false);
    }
  };

  return (
    <tr>
      <td
        style={(() => {
          if (
            updated_status == 0 ||
            (updated_status == null && props.question.status == 0)
          ) {
            return { color: "rgb(224, 0, 0)" };
          } else if (
            updated_status == 1 ||
            (updated_status == null && props.question.status == 1)
          ) {
            return { color: "rgb(0, 30, 224)" };
          } else {
            return { color: "rgb(0, 0, 0)" };
          }
        })()}
        className={(() => {})()}
      >
        {shorten_text(props.question.title, 10)}
      </td>
      <td>{props.question.stname}</td>
      <td>
        {(() => {
          if (props.question.status != 0) {
            return (
              <AdminUserName
                data_package={props.data_package}
                user_data={props.user_data}
                uid={props.question.by}
              />
            );
          } else {
            return "-";
          }
        })()}
      </td>
      <td>
        {(() => {
          if (props.question.status != 0) {
            return get_short_date_string(
              props.question.startAnsweringTimestamp.toDate()
            );
          } else {
            return "-";
          }
        })()}
      </td>
      <td
        className="dark-hover"
        style={(() => {
          if (!loading) {
            return { cursor: "grab" };
          }
        })()}
        onClick={change_status}
      >
        {loading ? "처리중" : "상태 바꾸기"}
      </td>
    </tr>
  );
}

export default AdminQuestionItem;
