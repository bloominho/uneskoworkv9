import { signOut } from "firebase/auth";

function Header(props) {
  const sign_out = () => {
    signOut(props.data_package.auth)
      .then(() => {
        // SIGN OUT SUCCESS
      })
      .catch((error) => {});
  };

  //--------- RETURN ---------------------------------------
  return (
    <div id="header" className="pb-1 mb-1">
      {/* LOGO AREA */}
      {(() => {
        if (props.page == 0) {
          return (
            <div
              onClick={() => {
                props.set_page(0);
              }}
              style={{ cursor: "grab" }}
            >
              <h1 id="loginTitleUp" className="body-font mb-0">
                <span className="univ3Color">유네스코</span>
              </h1>
              <h1 id="loginTitleDown" className="title-font">
                워크
              </h1>
            </div>
          );
        }
      })()}
      {/* MENU AREA */}
      {(() => {
        if (props.page == 0) {
          return (
            <h5 className="ms-1 text-dark-emphasis text-end">
              <span
                className="me-3 dark-hover"
                style={{ cursor: "grab" }}
                onClick={() => {
                  props.set_page(1);
                }}
              >
                <span className="material-symbols-outlined inline-icon">
                  person
                </span>
                {props.data_package.user.name}
              </span>
              {(() => {
                if (props.data_package.user.auth > 2) {
                  return (
                    <>
                      <span
                        className="me-3"
                        onClick={() => {
                          props.set_page(2);
                        }}
                      >
                        <span
                          className="material-symbols-outlined inline-icon dark-hover"
                          style={{ cursor: "grab" }}
                        >
                          admin_panel_settings
                        </span>
                      </span>
                    </>
                  );
                }
              })()}
              <span className="me-3" onClick={sign_out}>
                <span
                  className="material-symbols-outlined inline-icon dark-hover"
                  style={{ cursor: "grab" }}
                >
                  logout
                </span>
              </span>
            </h5>
          );
        } else if (props.page == 1 || props.page == 2) {
          return (
            <h5 className="ms-1 text-dark-emphasis mb-0">
              <span
                className="me-3 dark-hover"
                style={{ cursor: "grab" }}
                onClick={() => {
                  props.set_page(0);
                }}
              >
                <span className="material-symbols-outlined inline-icon">
                  first_page
                </span>
                되돌아가기
              </span>
            </h5>
          );
        }
      })()}
    </div>
  );
}

export default Header;
