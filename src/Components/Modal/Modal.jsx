import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import propTypes from "prop-types";

const modalRoot = document.querySelector("#modal-root");

export default function Modal({ closeFn, children }) {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  function handleKeyDown(event) {
    if (event.code === "Escape") {
      closeFn();
    }
  }
  function handleBackdrop(event) {
    if (event.currentTarget === event.target) {
      closeFn();
    }
  }

  return createPortal(
    <div className="Overlay" onClick={handleBackdrop}>
      <div className="Modal">{children}</div>
    </div>,
    modalRoot
  );
}
Modal.defaultProps = {
  children: null,
};

Modal.propTypes = {
  children: propTypes.node,
  closeFn: propTypes.func.isRequired,
};
