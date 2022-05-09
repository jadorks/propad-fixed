import React from "react";
import style from "./Button2.module.css";
import loading from "../assets/images/loading.svg";

function Button2({
  handleClick,
  type,
  className,
  isLoading = false,
  children,
  ...props
}) {
  return (
    <button
      onClick={!isLoading ? handleClick : null}
      className={`${style.button} ${style[type || "left-skewed"]} ${
        className || ""
      } `}
      {...props}
    >
      {!isLoading && children}
      {isLoading && (
        <p className={style.button_loading}>
          <img
            className={style.button_loading_img}
            src={loading}
            alt="Loading"
          />
        </p>
      )}
    </button>
  );
}

export default Button2;
