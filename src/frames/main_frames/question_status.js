import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  get_short_date_string,
  get_today_date_4AM,
} from "../../functions/time_functions";

import { get_count } from "../../functions/counts";

function QuestionStatus(props) {
  /** States------------------
   *    today_list (arr): list of today's questions
   * ------------------------- */
  const [today_list, set_today_list] = useState([]);

  /**------ Initial USE_EFFECT -----------------------------------------------
   *    : makes a listener to today's questions
   */
  useEffect(() => {
    const today = new Date();
    let today_date = get_today_date_4AM();

    // 1. Query
    const daily_ref = query(
      collection(props.data_package.db, "QuestionsV2"),
      where("date", "==", today_date),
      orderBy("creationTimestamp", "asc")
    );

    // 2. Make Listener
    const daily_list_snapshot = onSnapshot(
      daily_ref,
      (querySnapshot) => {
        set_today_list((prev_state) => {
          let new_state = [];
          querySnapshot.forEach((question) => {
            new_state.push(question.data());
          });
          return new_state;
        });
      },
      (error) => {}
    );

    // Detach listener when this module is unmounted
    return () => {
      daily_list_snapshot();
    };
  }, []);

  //--- Functions -----------------------------------------------------------
  const get_personal_count_string = () => {
    let user_count = {};
    today_list.forEach((question) => {
      if (question.status == 2) {
        if (user_count[question.by] != undefined) {
          user_count[question.by] = user_count[question.by] + 1;
        } else {
          user_count[question.by] = 1;
        }
      }
    });

    let string = "";
    for (const [key, value] of Object.entries(user_count)) {
      string += value + " ";
    }
    return string;
  };

  //--------- RETURN ---------------------------------------
  return (
    <div id="header" className="pb-1 mb-1">
      <div id="headerCard" className="py-3 px-4 rounded-4">
        <h4
          id="loginTitleUp"
          className="title-font mb-2"
          style={{ height: 30 + "px" }}
        >
          {get_short_date_string(get_today_date_4AM())}
        </h4>
        <h5 id="loginTitleUp" className="body-font mb-2">
          <span className="material-symbols-outlined inline-icon">
            description
          </span>
          {today_list.length}
          <span className="material-symbols-outlined inline-icon ms-2">
            done_outline
          </span>
          {get_count(today_list, 2)}
          <span className="material-symbols-outlined inline-icon ms-2">
            person
          </span>
          {get_count(today_list, 2, props.data_package.user.uid)}
        </h5>
        <h5 id="loginTitleUp" className="body-font mb-2">
          <span className="material-symbols-outlined inline-icon">group</span>{" "}
          {get_personal_count_string()}
        </h5>
        <div className="">
          <div className="progress-stacked">
            <div
              className="progress"
              role="progressbar"
              aria-label="Segment one"
              aria-valuenow={
                (100 * get_count(today_list, 2, props.data_package.user.uid)) /
                today_list.length
              }
              aria-valuemin="0"
              aria-valuemax="100"
              style={{
                width:
                  (100 *
                    get_count(today_list, 2, props.data_package.user.uid)) /
                    today_list.length +
                  "%",
              }}
            >
              <div className="progress-bar progress-bar-striped bg-success"></div>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Segment two"
              aria-valuenow={
                (100 *
                  (get_count(today_list, 2) -
                    get_count(today_list, 2, props.data_package.user.uid))) /
                today_list.length
              }
              aria-valuemin="0"
              aria-valuemax="100"
              style={{
                width:
                  (100 *
                    (get_count(today_list, 2) -
                      get_count(today_list, 2, props.data_package.user.uid))) /
                    today_list.length +
                  "%",
              }}
            >
              <div className="progress-bar bg-success"></div>
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-label="Segment three"
              aria-valuenow={
                (100 * get_count(today_list, 1)) / today_list.length
              }
              aria-valuemin="0"
              aria-valuemax="100"
              style={{
                width:
                  (100 * get_count(today_list, 1)) / today_list.length + "%",
              }}
            >
              <div className="progress-bar bg-secondary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionStatus;
