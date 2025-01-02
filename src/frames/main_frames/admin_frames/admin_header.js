function AdminHeader(props) {
  return (
    <div className="border-top border-bottom mb-3">
      <div
        className="title-font fs-1 mt-1 text-center"
        style={{ color: "rgb(68, 68, 68)" }}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="rgb(50, 50, 50)"
            className="bi bi-file-earmark-text-fill pt-3"
            viewBox="0 0 15 19"
          >
            <path
              fill-rule="evenodd"
              d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793z"
            />
          </svg>
        </div>
        관리영역
      </div>

      <h5 className="text-dark-emphasis text-center my-2">
        <span
          className="me-4 dark-hover"
          style={{ cursor: "grab" }}
          onClick={() => {
            props.set_page(0);
          }}
        >
          <span className="material-symbols-outlined inline-icon">
            bar_chart
          </span>
          알림판
        </span>

        <span
          className="me-4 dark-hover"
          style={{ cursor: "grab" }}
          onClick={() => {
            props.set_page(1);
          }}
        >
          <span className="material-symbols-outlined inline-icon">list</span>
          질문관리
        </span>

        <span
          className="me-4 dark-hover"
          style={{ cursor: "grab" }}
          onClick={() => {
            props.set_page(2);
          }}
        >
          <span className="material-symbols-outlined inline-icon">
            manage_accounts
          </span>
          계정관리
        </span>
      </h5>
    </div>
  );
}

export default AdminHeader;
