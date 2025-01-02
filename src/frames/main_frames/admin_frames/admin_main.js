import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminUserName from "./admin_user_name";
import CanceledItem from "./canceled_item";
import {
  get_time_string,
  get_today_date_4AM,
} from "../../../functions/time_functions";
import { get_count } from "../../../functions/counts";

function AdminMain(props) {
  /** States------------------
   *    today_question_list (arr): list of today's questions
   * ------------------------- */

  const [temp_fullYear, set_temp_fullYear] = useState(
    (() => {
      return new Date().getFullYear();
    })()
  );
  const [temp_month, set_temp_month] = useState(
    (() => {
      return new Date().getMonth() + 1;
    })()
  );
  const [temp_date, set_temp_date] = useState(
    (() => {
      return new Date().getDate();
    })()
  );

  const [query_date, set_query_date] = useState(
    (() => {
      return get_today_date_4AM();
    })()
  );
  const [question_list, set_question_list] = useState([]);

  const [current_question, set_current_question] = useState(null);

  /** useEffect */
  /** Date Changed */
  useEffect(() => {
    // Query Reference
    const ref = query(
      collection(props.data_package.db, "QuestionsV2"),
      where("date", "==", query_date),
      orderBy("creationTimestamp", "asc")
    );

    const listener = onSnapshot(
      ref,
      (querySnapshot) => {
        // When new question list -> store it again.
        set_question_list((prev_state) => {
          let new_state = [];
          querySnapshot.forEach((question) => {
            new_state.push(question.data());
          });
          return new_state;
        });
      },
      (error) => {
        // IF ERROR: Do Nothing
      }
    );

    return () => {
      listener(); //detach listener
    };
  }, [query_date]);

  //--- Functions -------------------

  const get_personal = () => {
    let view_list = [];
    let personal_list = {};
    question_list.forEach((question) => {
      if (question.status == 2) {
        if (personal_list[String(question.by)] == undefined) {
          personal_list[String(question.by)] = 1;
        } else {
          personal_list[String(question.by)]++;
        }
      }
    });

    let personal_arr = [];
    for (const [key, value] of Object.entries(personal_list)) {
      personal_arr.push([key, value]);
    }
    personal_arr.sort((a, b) => {
      if (a[1] > b[1]) {
        return 1;
      } else {
        return -1;
      }
    });

    personal_arr.forEach((person_data) => {
      view_list.push(
        <h5
          key={person_data[0]}
          id="loginTitleUp"
          className="body-font mb-2 me-3"
          style={{ display: "inline-block" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="26"
            fill="rgb(50, 50, 50)"
            className="bi bi-file-earmark-text-fill"
            viewBox="0 0 16 18"
          >
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
          </svg>
          <AdminUserName
            data_package={props.data_package}
            user_data={props.user_data}
            uid={person_data[0]}
          />
          : {person_data[1]}
        </h5>
      );
    });
    return view_list;
  };

  //--- RETURN -----------------------
  return (
    <div className="mt-3">
      {/* DATE PICKER */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="title-font fs-1" style={{ paddingLeft: "1ch" }}>
          <input
            type="numbers"
            aria-label="Year"
            className="form-control border-0 border-bottom border-2 border-dark rounded-0 p-0 me-1 fs-1"
            value={temp_fullYear}
            style={{
              width:
                Math.min(
                  Math.max(
                    1,
                    temp_fullYear.length == undefined ? 4 : temp_fullYear.length
                  ),
                  5
                ) + "ch",
              height: 1.6 + "ch",
              display: "inline-block",
              textAlign: "center",
            }}
            onChange={(event) => {
              set_temp_fullYear(event.target.value.replace(/\D/g, ""));
            }}
          />
          년
          <input
            type="numbers"
            aria-label="Year"
            className="form-control border-0 border-bottom border-2 border-dark rounded-0 p-0 ms-2 me-1 fs-1"
            value={temp_month}
            style={{
              width:
                Math.min(
                  Math.max(
                    1,
                    temp_month.length == undefined ? 2 : temp_month.length
                  ),
                  3
                ) + "ch",
              height: 1.6 + "ch",
              display: "inline-block",
              textAlign: "center",
            }}
            onChange={(event) => {
              set_temp_month(event.target.value.replace(/\D/g, ""));
            }}
          />
          월
          <input
            type="numbers"
            aria-label="Year"
            className="form-control border-0 border-bottom border-2 border-dark rounded-0 p-0 ms-2 me-1 fs-1"
            value={temp_date}
            style={{
              width:
                Math.min(
                  Math.max(
                    1,
                    temp_date.length == undefined ? 2 : temp_date.length
                  ),
                  3
                ) + "ch",
              height: 1.6 + "ch",
              display: "inline-block",
              textAlign: "center",
            }}
            onChange={(event) => {
              set_temp_date(event.target.value.replace(/\D/g, ""));
            }}
          />
          일
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="3ch"
            height="1.5ch"
            fill="rgb(154, 154, 154)"
            className="bi bi-arrow-right-square-fill ms-0 dark-hover"
            viewBox="0 0 21 21"
            onClick={() => {
              set_current_question(null);
              set_query_date(
                (() => {
                  return new Date(temp_fullYear, temp_month - 1, temp_date, 9);
                })()
              );
            }}
          >
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
          </svg>
        </div>
      </div>
      {/* ARRAY */}
      <div className="row row-cols-auto mt-3" style={{ width: 100 + "%" }}>
        {(() => {
          let view_arr = [];
          let i = 1;
          question_list.forEach((question) => {
            const click_function = ((j) => {
              if (current_question == j - 1) {
                set_current_question(null);
              } else {
                set_current_question(j - 1);
              }
            }).bind(null, i);

            view_arr.push(
              <div
                key={question.id}
                className="py-1 px-2 m-1 position-relative body-font"
                style={{ cursor: "pointer" }}
                onClick={click_function}
              >
                {(() => {
                  if (question.status == 0) {
                    return (
                      <span className="position-absolute top-20 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                        <span className="visually-hidden">Not Answered</span>
                      </span>
                    );
                  } else if (question.status == 1) {
                    return (
                      <span className="position-absolute top-20 start-100 translate-middle p-1 bg-primary border border-primary rounded-circle">
                        <span className="visually-hidden">Not Answered</span>
                      </span>
                    );
                  } else {
                    return (
                      <span className="position-absolute top-20 start-100 translate-middle p-1 bg-success border border-success rounded-circle">
                        <span className="visually-hidden">Not Answered</span>
                      </span>
                    );
                  }
                })()}
                {(() => {
                  if (i == current_question + 1) {
                    return <div className="title-font">{i}</div>;
                  } else {
                    return <div>{i}</div>;
                  }
                })()}
              </div>
            );
            i++;
          });
          return view_arr;
        })()}
      </div>
      {/* ARRAY INFO */}
      {(() => {
        if (current_question != null) {
          return (
            <div id="header" className="pb-1 mb-1">
              <div
                className="py-3 px-4 rounded-4"
                style={{ backgroundColor: "rgb(239, 239, 239)" }}
              >
                <h5
                  id="loginTitleUp"
                  className="title-font mb-2"
                  style={{ height: 30 + "px" }}
                >
                  {current_question + 1}.{" "}
                  {question_list[current_question].title}
                </h5>
                <h5 id="loginTitleUp" className="body-font mb-2">
                  <span className="material-symbols-outlined inline-icon">
                    person
                  </span>
                  {question_list[current_question].stname}
                  {(() => {
                    if (question_list[current_question].status != 0) {
                      return (
                        <>
                          <span className="material-symbols-outlined inline-icon ms-2">
                            done_outline
                          </span>
                          <AdminUserName
                            data_package={props.data_package}
                            user_data={props.user_data}
                            uid={question_list[current_question].by}
                          />
                        </>
                      );
                    }
                  })()}
                  {}
                </h5>
                {(() => {
                  if (question_list[current_question].status == 1) {
                    return (
                      <>
                        <h5 id="loginTitleUp" className="body-font mb-2">
                          <span className="material-symbols-outlined inline-icon">
                            schedule
                          </span>{" "}
                          {get_time_string(
                            question_list[
                              current_question
                            ].startAnsweringTimestamp.toDate()
                          )}
                          ~
                        </h5>
                      </>
                    );
                  } else if (question_list[current_question].status == 2) {
                    return (
                      <>
                        <h5 id="loginTitleUp" className="body-font mb-2">
                          <span className="material-symbols-outlined inline-icon">
                            schedule
                          </span>{" "}
                          {get_time_string(
                            question_list[
                              current_question
                            ].startAnsweringTimestamp.toDate()
                          )}
                          ~
                          {get_time_string(
                            question_list[
                              current_question
                            ].completeAnsweringTimestamp.toDate()
                          )}
                        </h5>
                      </>
                    );
                  }
                })()}
              </div>
            </div>
          );
        }
      })()}
      {/* DAY SUMMARY */}
      <div className="mt-2 mb-4">
        <h4 id="loginTitleUp" className="title-font mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="23"
            fill="rgb(50, 50, 50)"
            className="bi bi-file-earmark-text-fill me-1"
            viewBox="0 0 15 19"
          >
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z" />
          </svg>
          전체: {question_list.length}개
        </h4>
        <h4
          id="loginTitleUp"
          className="title-font mb-2"
          style={{ color: "rgb(100,100,100)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="23"
            fill="rgb(100,100,100)"
            className="bi bi-file-earmark-text-fill me-1"
            viewBox="0 0 15 19"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
          </svg>
          답변 중: {get_count(question_list, 1)}개
        </h4>
        <h4
          id="loginTitleUp"
          className="title-font mb-2"
          style={{ color: "rgb(100,100,100)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="23"
            fill="rgb(100,100,100)"
            className="bi bi-file-earmark-text-fill me-1"
            viewBox="0 0 15 19"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
          완료: {get_count(question_list, 2)}개
        </h4>
        <h4 id="loginTitleUp" className="title-font mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="23"
            fill="rgb(50, 50, 50)"
            className="bi bi-file-earmark-text-fill me-1"
            viewBox="0 0 15 20"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
          미답변: {get_count(question_list, 0)}개
        </h4>
      </div>
      {/* Personal Summary */}
      <div className="mb-5">
        <h4 id="loginTitleUp" className="title-font mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="26"
            fill="rgb(50, 50, 50)"
            className="bi bi-file-earmark-text-fill me-2"
            viewBox="0 0 16 18"
          >
            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
          </svg>
          개인별 답변 수
        </h4>
        <div className="ms-2">{get_personal()}</div>
      </div>
      {/* Canceled Questions */}
      <div>
        {(() => {
          let arr_view = [];
          let canceled_exists = false;
          let i = 1;
          question_list.forEach((question) => {
            if (question.status == 0 && question.canceled.length > 0) {
              canceled_exists = true;
              let text = "";
              Object.entries(question.canceled[0]).forEach(([key, value]) => {
                text = value;
              });

              arr_view.push(
                <>
                  <CanceledItem
                    index={i}
                    title={question.title}
                    canceled_text={text}
                    question_id={question.id}
                    data_package={props.data_package}
                  />
                </>
              );

              i++;
            }
          });

          if (canceled_exists) {
            return (
              <>
                <h4 id="loginTitleUp" className="title-font mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="26"
                    fill="rgb(50, 50, 50)"
                    className="bi bi-file-earmark-text-fill me-2"
                    viewBox="0 0 16 18"
                  >
                    <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                  </svg>
                  취소한 답변들
                </h4>
                {arr_view}
              </>
            );
          } else {
            return <></>;
          }
        })()}
      </div>
    </div>
  );
}

export default AdminMain;
