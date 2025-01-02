import { doc, serverTimestamp, runTransaction } from "firebase/firestore";
import { useState } from "react";
import {
  number_in_2characters,
  shorten_text,
} from "../../../functions/numbers_and_texts";

/** USE: AdminMain
 *    - Single canceled question
 */
function CanceledItem(props) {
  /** loading: if) finish answering is clicked -> Print "Loading Status"  */
  const [loading, set_loading] = useState(false);

  /** Finish Answering
   *    First, Check if the question is still waiting
   *    Then, IF the question is still waiting, start answering
   */
  const finish_answering = async () => {
    set_loading(true);
    try {
      const question_ref = doc(
        props.data_package.db,
        "QuestionsV2",
        String(props.question_id)
      );
      await runTransaction(props.data_package.db, async (transaction) => {
        const questionDoc = await transaction.get(question_ref);
        if (questionDoc.data().status == 0) {
          transaction.update(question_ref, {
            status: 2,
            by: String(props.data_package.user.uid),
            startAnsweringTimestamp: serverTimestamp(),
            completeAnsweringTimestamp: serverTimestamp(),
            updateTimestamp: serverTimestamp(),
          });
        } else {
          set_loading(false);
        }
      });
    } catch (e) {
      set_loading(false);
    }
  };

  return (
    <div className="my-3">
      <h5 className="m-0" style={{ lineHeight: 1 }}>
        <span className="title-font" style={{ fontSize: 0.6 + "em" }}>
          {number_in_2characters(props.index)}.
        </span>
        <span className="title-font ms-2" style={{ color: "rgb(61, 61, 61)" }}>
          {shorten_text(props.title, 25)}
        </span>
      </h5>
      <span
        className="body-font ms-4"
        style={{ color: "rgb(73, 73, 73)", fontSize: 1 + "em" }}
      >
        {props.canceled_text} {" / "}
      </span>
      <span
        className="body-font dark-hover"
        style={{ color: "rgb(73, 73, 73)", fontSize: 1 + "em" }}
        onClick={finish_answering}
      >
        {(() => {
          if (loading) {
            return "처리중";
          } else {
            return "답변완료>";
          }
        })()}
      </span>
    </div>
  );
}

export default CanceledItem;
