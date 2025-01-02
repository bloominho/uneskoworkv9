import { useState } from "react";

import ProcessableButton from "../micro_frames/processable_button";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

function SignUp(props) {
  /** States------------------
   *  name (text)
   *  email (text)
   * 	password (text)
   * 	error_message (text)
   * 	processing (boolean)
   * ------------------------- */

  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error_message, set_error_message] = useState("");
  const [processing, set_processing] = useState(false);

  /** Functions */
  const sign_up = async () => {
    /** 1. Set Proccessing */
    await set_processing(true);

    /** 2. Check Vailidaty */
    if (name.trim() === "") {
      set_error_message("이름을 입력해주세요");
      await set_processing(false);
    } else {
      /** 3. Sign Up */
      await createUserWithEmailAndPassword(
        props.data_package.auth,
        email,
        password
      )
        .then(async (user_credential) => {
          // USER CREATED

          /** 4. Create Profile */
          const user_doc_ref = doc(
            collection(props.data_package.db, "users_v2"),
            user_credential.user.uid
          );

          /** USER PROFILE
           *  auth (number)
           *    0: unauthorized
           *    1: awaiting authorization
           *    2: authorized
           *    3: administrator
           */

          await setDoc(user_doc_ref, {
            auth: 1,
            uid: user_credential.user.uid,
            name: name.trim(),
            email: email.trim(),
            creationTimestamp: serverTimestamp(),
            updateTimestamp: serverTimestamp(),
            version: "1.0",
          }).catch(async (error) => {
            // USER DOCUMENT CREATION FAILED
            await set_error_message(error.message);
            await set_processing(false);
          });
        })
        .catch(async (error) => {
          // COULD NOT MAKE ACCOUNT
          await set_error_message(error.message);
          await set_processing(false);
        });
    }
  };

  return (
    <div id="signUpForm">
      <div>
        <h1 id="loginTitleUp" className="title-font mb-4 loginTitle">
          환영합니다 !
        </h1>
        <div className="mb-3">
          <label htmlFor="loginNameInput" className="form-label mb-1">
            이름
          </label>
          <input
            type="text"
            id="loginNameInput"
            className="form-control"
            value={name}
            onChange={(event) => {
              set_name(event.target.value);
            }}
          />
        </div>
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
                sign_up();
              }
            }}
          />
        </div>
        <h5 className="text-danger">{error_message}</h5>
        <ProcessableButton
          processing={processing}
          onClick={sign_up}
          text="가입하기"
        />

        <div className="w-100 mt-3">
          이미 계정이 있으신가요?{" "}
          <span className="text-button" onClick={props.change_signin_page}>
            로그인하기
          </span>
        </div>
        {/*<img className="center-logo mt-5" src="./img/univ3_logo_red.png" alt="대학3부 로고" width="40" height="40"/>*/}
      </div>
    </div>
  );
}

export default SignUp;
