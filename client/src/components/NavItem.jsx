import React from "react";
import { NavLink } from "react-router-dom";
//You can give this component any color via the type prop
function NavItem({ image, text, url = "/", type, disabled = false }) {
  return (
    <>
      {!disabled ? (
        <NavLink
          exact
          to={url}
          className={`nav-item ${type || ""}`}
          activeClassName="nav-item__active"
        >
          <img src={image} alt="Nav Link Icon" />
          <p>{text}</p>
        </NavLink>
      ) : (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a disabled className="nav-item disabled">
          <img src={image} alt="Nav Link Icon" />
          <p>{text}</p>
        </a>
      )}
    </>
  );
}

export default NavItem;
