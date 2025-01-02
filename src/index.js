import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

/** Firebase */
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  setDoc,
  serverTimestamp,
  terminate,
  memoryLocalCache,
} from "firebase/firestore";
import SignInMainFrame from "./frames/signin_frames/signin_main_frame";
import MainFrame from "./frames/main_frames/main_frame";
import Error from "./frames/error";
import { firebaseConfig } from "./firebase_init";

/**--- Initialize React */
const root = ReactDOM.createRoot(document.getElementById("root"));

/**--- Initialize Firebase */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let db;

/**--- Check Login ---*/
onAuthStateChanged(auth, async (user) => {
  if (user) {
    db = getFirestore(app);
    //--- User Signed In => MainFrame

    //--- Get User Profile
    const user_doc_ref = doc(collection(db, "users_v2"), String(user.uid));
    let user_doc;
    let error = false;
    try {
      user_doc = await getDoc(user_doc_ref);
    } catch (e) {
      error = true;
      root.render(
        <div className="outer card border border-0 container-fluid position-absolute start-50 translate-middle-x">
          <Error error_code="0x001" />
        </div>
      );
    }

    if (!error) {
      if (!user_doc.exists()) {
        // User Profile Document does not exist -> update it to V2
        let user_doc_old_ref = doc(collection(db, "users"), String(user.email));
        let user_doc_old = await getDoc(user_doc_old_ref);
        let user_doc_old_data = user_doc_old.data();

        // Evaluate Auth State
        let auth_state = 0;
        if (user_doc_old_data.isAdmin) {
          auth_state = 3;
        } else if (user_doc_old_data.authState) {
          auth_state = 2;
        }

        // Write to New User Profile Database
        await setDoc(user_doc_ref, {
          auth: auth_state,
          uid: user.uid,
          name: user_doc_old_data.name,
          email: user_doc_old_data.email,
          creationTimestamp: serverTimestamp(),
          updateTimestamp: serverTimestamp(),
          version: "1.0",
        }).catch(async (error) => {
          // Failed to create user document v2
          // TODO: ERROR PAGE
        });

        // Since it's updated,
        // retry geting profile
        user_doc = await getDoc(user_doc_ref);
      }

      let user_data = user_doc.data();

      root.render(
        <div className="outer card border border-0 container-fluid position-absolute start-50 translate-middle-x">
          <MainFrame
            data_package={{ app: app, auth: auth, db: db, user: user_data }}
          />
        </div>
      );
    }
  } else {
    //--- User Signed Out => SignInMainFrame
    root.render(
      <div className="outer card  border border-0 container-fluid position-absolute top-50 start-50 translate-middle">
        <SignInMainFrame data_package={{ app: app, auth: auth, db: db }} />
      </div>
    );
  }
});
