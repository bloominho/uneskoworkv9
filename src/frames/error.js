function Error(props) {
  return (
    <div id="signInForm">
      <div className="border-top border-bottom mb-1">
        <div
          className="title-font fs-1 mt-1 text-center"
          style={{ color: "rgb(68, 68, 68)" }}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              fill="rgb(50, 50, 50)"
              className="bi bi-file-earmark-text-fill pt-3"
              viewBox="0 0 15 19"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372zm-2.54 1.183L5.93 9.363 1.591 6.602z" />
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0m0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
            </svg>
          </div>
          에러가 발생했습니다 ㅜ
        </div>

        <h5 className="text-dark-emphasis text-center my-2">
          <span className="me-4" style={{ cursor: "default" }}>
            <span className="material-symbols-outlined inline-icon">chat</span>
            팀장에게 알려주세요 : {")"}, 에러코드: {props.error_code}
          </span>
        </h5>
      </div>
    </div>
  );
}

export default Error;
