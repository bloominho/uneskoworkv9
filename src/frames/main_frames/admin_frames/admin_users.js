import {
  collection,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  doc,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function AdminUsers(props) {
  /** states
   * 	- user_list (arr)
   * 	- show_refused (boolean)
   */
  const [user_list, set_user_list] = useState([]);
  const [show_refused, set_show_refused] = useState(false);

  /** Initialize
   * 		1. Download Users (auth > 1)
   */
  useEffect(() => {
    const ref = query(
      collection(props.data_package.db, "users_v2"),
      orderBy("creationTimestamp", "desc"),
      limit(100)
    );

    // Make Listener
    const user_snapshot = onSnapshot(
      ref,
      (querySnapshot) => {
        set_user_list((prev_state) => {
          let new_list = [];
          querySnapshot.forEach((user) => {
            new_list.push(user.data());
          });
          return new_list;
        });
      },
      (error) => {}
    );

    // When Exiting this frame: Detach listener
    return () => {
      user_snapshot();
    };
  }, []);

  //------ Change Credentials -----------------
  const change_auth = async (uid, auth, admin) => {
    if (uid != props.data_package.user.uid) {
      // cannot change my credentials
      // New batch
      const batch = writeBatch(props.data_package.db);

      //user ref
      const user_ref = doc(props.data_package.db, "users_v2", String(uid));
      const auth_level = admin ? 3 : auth ? 2 : 0;
      batch.update(user_ref, { auth: auth_level });
      // auth ref
      const auth_ref = doc(props.data_package.db, "auth", String(uid));
      batch.set(auth_ref, { auth: auth, admin: admin }, { merge: true });

      await batch.commit();
    }
  };

  //------ Make Views -------------------------

  /** 1. Admin Users */
  const admin_view = () => {
    let list = [];
    user_list.forEach((user) => {
      if (user.auth == 3) {
        list.push(
          <tr key={user.uid}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td
              className="dark-hover"
              style={{ cursor: "grab" }}
              onClick={() => {
                change_auth(user.uid, true, false);
              }}
            >
              관리자 해제
            </td>
          </tr>
        );
      }
    });
    return list;
  };

  /** 2. Basic Users */
  const basic_view = () => {
    let list = [];
    user_list.forEach((user) => {
      if (user.auth == 2) {
        list.push(
          <tr key={user.uid}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td
              className="dark-hover"
              style={{ cursor: "grab" }}
              onClick={() => {
                change_auth(user.uid, true, true);
              }}
            >
              관리자 설정
            </td>
            <td
              className="dark-hover"
              style={{ cursor: "grab" }}
              onClick={() => {
                change_auth(user.uid, false, false);
              }}
            >
              승인해제
            </td>
          </tr>
        );
      }
    });
    return list;
  };

  /** 3. Waiting Users */
  const waiting_exists = () => {
    let exists = false;
    user_list.forEach((user) => {
      if (user.auth == 1) {
        exists = true;
      }
    });
    return exists;
  };

  const waiting_view = () => {
    let list = [];
    user_list.forEach((user) => {
      if (user.auth == 1) {
        list.push(
          <tr key={user.uid}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td
              className="dark-hover"
              style={{ cursor: "grab" }}
              onClick={() => {
                change_auth(user.uid, true, false);
              }}
            >
              승인하기
            </td>
          </tr>
        );
      }
    });
    return list;
  };

  /** 4. Refused */
  const refused_view = () => {
    let list = [];
    user_list.forEach((user) => {
      if (user.auth == 0) {
        list.push(
          <tr key={user.uid}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td
              className="dark-hover"
              style={{ cursor: "grab" }}
              onClick={() => {
                change_auth(user.uid, true, false);
              }}
            >
              승인하기
            </td>
          </tr>
        );
      }
    });
    return list;
  };

  return (
    <div className="mt-2">
      {/* Exists Waiting user */}
      {(() => {
        if (waiting_exists()) {
          return (
            <div>
              <div
                className="title-font fs-3"
                style={{ color: "rgb(47, 47, 47)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-file-earmark-text-fill me-2"
                  viewBox="0 0 18 18"
                >
                  <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a1 1 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207" />
                  <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                </svg>
                승인 대기중
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">이름</th>
                    <th scope="col">이메일</th>
                    <th scope="col">승인</th>
                  </tr>
                </thead>
                <tbody>{waiting_view()}</tbody>
              </table>
            </div>
          );
        }
      })()}
      {/* Plain User */}
      <div>
        <div className="title-font fs-3" style={{ color: "rgb(47, 47, 47)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-file-earmark-text-fill me-2"
            viewBox="0 0 18 18"
          >
            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
          </svg>
          일반 계정
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">이름</th>
              <th scope="col">이메일</th>
              <th scope="col">관리자 설정</th>
              <th scope="col">승인 해제</th>
            </tr>
          </thead>
          <tbody>{basic_view()}</tbody>
        </table>
      </div>
      {/* Admin User */}
      <div>
        <div className="title-font fs-3" style={{ color: "rgb(47, 47, 47)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-file-earmark-text-fill me-2"
            viewBox="0 0 18 18"
          >
            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
          </svg>
          관리자 계정
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">이름</th>
              <th scope="col">이메일</th>
              <th scope="col">관리자 해제</th>
            </tr>
          </thead>
          <tbody>{admin_view()}</tbody>
        </table>
      </div>
      {/* Refused Users */}
      <div>
        <div className="title-font fs-3" style={{ color: "rgb(47, 47, 47)" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-file-earmark-text-fill me-2"
            viewBox="0 0 18 18"
          >
            <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465m-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
          </svg>
          승인해제된 계정
        </div>
        {(() => {
          if (show_refused) {
            return (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">이름</th>
                    <th scope="col">이메일</th>
                    <th scope="col">승인</th>
                  </tr>
                </thead>
                <tbody>{refused_view()}</tbody>
              </table>
            );
          }
        })()}
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              set_show_refused((prev_state) => {
                return !prev_state;
              });
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
              {(() => {
                if (!show_refused) {
                  return (
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                  );
                } else {
                  return (
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  );
                }
              })()}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
