import { useState } from "react";
import AdminMain from "./admin_main";
import AdminHeader from "./admin_header";
import AdminQuestionFrame from "./admin_question_frame";
import AdminUsers from "./admin_users";

function AdminMainFrame(props) {
  /** States------------------
   *    page
   *      0: Main Page
   *      1: Question Control
   * 	  2: User Control
   * ------------------------- */

  const [page, set_page] = useState(0);
  const [user_list, set_user_list] = useState({});

  if (page == 1) {
    // Question Control
    return (
      <>
        <AdminHeader data_package={props.data_package} set_page={set_page} />
        <AdminQuestionFrame
          data_package={props.data_package}
          user_data={[user_list, set_user_list]}
        />
      </>
    );
  } else if (page == 2) {
    // User Control
    return (
      <>
        <AdminHeader data_package={props.data_package} set_page={set_page} />
        <AdminUsers data_package={props.data_package} set_page={set_page} />
      </>
    );
  } else {
    // Main Page
    return (
      <>
        <AdminHeader data_package={props.data_package} set_page={set_page} />
        <AdminMain
          data_package={props.data_package}
          user_data={[user_list, set_user_list]}
        />
      </>
    );
  }
}

export default AdminMainFrame;
