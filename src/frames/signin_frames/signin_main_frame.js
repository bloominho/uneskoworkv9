import { useState } from "react";

import SignIn from "./sign_in";
import SignUp from "./sign_up";

function SignInMainFrame(props) {
  /** States------------------
   *    page
   *      0: Sign In
   *      1: Sign Up
   * ------------------------- */

  const [page, set_page] = useState(0);

  // Chage Page (Sign In <-> Sign Up)
  const change_page = () => {
    set_page(page == 0 ? 1 : 0);
  };

  if (page == 0) {
    // SIGN IN PAGE
    return (
      <SignIn
        data_package={props.data_package}
        change_signin_page={change_page}
      />
    );
  } else if (page == 1) {
    // SIGN UP PAGE
    return (
      <SignUp
        data_package={props.data_package}
        change_signin_page={change_page}
      />
    );
  }
}

export default SignInMainFrame;
