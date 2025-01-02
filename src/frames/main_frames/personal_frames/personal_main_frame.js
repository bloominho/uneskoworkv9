import { useState } from "react";
import PersonalHeader from "./personal_header";
import PersonalList from "./personal_list";

function PersonalMainFrame(props) {
  const [page, set_page] = useState(0);

  return (
    <>
      <PersonalHeader data_package={props.data_package} />
      <PersonalList data_package={props.data_package} />
    </>
  );
}

export default PersonalMainFrame;
