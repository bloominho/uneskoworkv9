import { useState } from "react";

import QuestionFrame from "./question_frame";
import AdminMainFrame from "./admin_frames/admin_main_frame";
import Header from "./header";
import PersonalMainFrame from "./personal_frames/personal_main_frame";

function MainFrame(props) {
  /** Pages------------------
   * 	page (number)
   *      0: Question Frame
   *      1: My Page
   * 	  2: Admin Page
   * ------------------------- */
  const [page, set_page] = useState(0);

  if (page == 0) {
    return (
      <>
        <Header
          data_package={props.data_package}
          set_page={set_page}
          page={page}
        />
        <QuestionFrame data_package={props.data_package} set_page={set_page} />
      </>
    );
  } else if (page == 1) {
    return (
      <>
        <Header
          data_package={props.data_package}
          set_page={set_page}
          page={page}
        />
        <PersonalMainFrame data_package={props.data_package} />
      </>
    );
  } else if (page == 2) {
    return (
      <>
        <Header
          data_package={props.data_package}
          set_page={set_page}
          page={page}
        />
        <AdminMainFrame data_package={props.data_package} />
      </>
    );
  } else {
    return (
      <>
        <Header
          data_package={props.data_package}
          set_page={set_page}
          page={page}
        />
        <QuestionFrame data_package={props.data_package} set_page={set_page} />
      </>
    );
  }
}

export default MainFrame;
