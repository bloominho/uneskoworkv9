import React from "react";

function ProcessableButton(props) {
  if (!props.processing) {
    return (
      <div>
        <button
          type="button"
          className="btn btn-dark w-100 mt-1"
          onClick={props.onClick}
        >
          {props.text}
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button type="button" className="btn btn-dark w-100 mt-1">
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Loading...</span>
        </button>
      </div>
    );
  }
}

export default ProcessableButton;
