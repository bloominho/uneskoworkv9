import { useState } from "react";

import ProcessableButton from "../micro_frames/processable_button";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

function SignIn(props) {
  /** States------------------
   *    email (text),
   * 	password (text)
   * 	error_message (text)
   * 	processing (boolean)
   * ------------------------- */

  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error_message, set_error_message] = useState("");
  const [processing, set_processing] = useState(false);

  /** Functions */
  const sign_in = async () => {
    /** 1. Set Proccessing */
    set_processing(true);

    /** 2. Sign In */
    setPersistence(props.data_package.auth, browserSessionPersistence).then(
      () => {
        signInWithEmailAndPassword(props.data_package.auth, email, password)
          .then((user_credential) => {
            // SIGN IN SUCCESS : page will automatically redirect from index.js
          })
          .catch(async (error) => {
            // SIGN IN FAIL
            const error_code = error.code;
            const error_message = error.message;
            set_error_message(error_message);
            set_processing(false);
          });
      }
    );
  };

  return (
    <div id="signInForm">
      <div>
        <h1 id="loginTitleUp" className="body-font mb-0">
          <span className="univ3Color">유네스코</span>
        </h1>
        <h1 id="loginTitleDown" className="title-font mb-4">
          워크
        </h1>
        <div className="mb-3">
          <label htmlFor="loginEmailInput" className="form-label mb-1">
            이메일
          </label>
          <input
            type="email"
            id="loginEmailInput"
            className="form-control"
            value={email}
            onChange={(event) => {
              set_email(event.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="loginPasswordInput" className="form-label mb-1">
            비밀번호
          </label>
          <input
            type="password"
            id="loginPasswordInput"
            className="form-control"
            value={password}
            onChange={(event) => {
              set_password(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sign_in();
              }
            }}
          />
        </div>
        <h5 className="text-danger">{error_message}</h5>
        <ProcessableButton
          processing={processing}
          onClick={sign_in}
          text="로그인"
        />

        <div className="w-100 mt-3 mb-5">
          아직 계정이 없으신가요?{" "}
          <span className="text-button" onClick={props.change_signin_page}>
            가입하기
          </span>
        </div>
        {/*<img className="center-logo mt-5" src="./img/univ3_logo_red.png" alt="대학3부 로고" width="40" height="40"/>*/}
      </div>
    </div>
  );
}

export default SignIn;
