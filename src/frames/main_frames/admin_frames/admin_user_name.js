import { doc, getDoc } from "firebase/firestore";

function AdminUserName(props) {
  (() => {
    (async () => {
      if (props.user_data[0][props.uid] == undefined) {
        // Download from firebase
        const ref = doc(props.data_package.db, "users_v2", String(props.uid));
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          props.user_data[1]((old_state) => {
            let new_state = { ...old_state };
            new_state[String(props.uid)] = docSnap.data();
            return new_state;
          });
        }
      }
    })();
  })();

  if (props.user_data[0][props.uid] == undefined) {
    return <>---</>;
  } else {
    return <>{props.user_data[0][props.uid]["name"]}</>;
  }
}

export default AdminUserName;
