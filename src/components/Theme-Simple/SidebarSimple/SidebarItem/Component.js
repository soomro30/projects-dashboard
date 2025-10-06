import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Component = ({
  url = "",
  title,
  subTitle,
  icon,
  iconWrapperClass,
  topMargin,
  children,
  subMenuItem,
  end = true,
  className: customClassName,
  activeStyle = { color: "#000000" },
  ...props
}) => {
  return (
    <li className={topMargin}>
      <NavLink
        to={url}
        end={end}
        {...props}
        className={({ isActive }) =>
          `${customClassName ? `${customClassName} ` : ""}detailed${
            isActive ? " active" : ""
          }`
        }
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
      >
        <span
          className={subTitle || subMenuItem ? "title" : "title line-height-40"}
        >
          {title}
        </span>
        {subTitle && <span className="details">{subTitle}</span>}
      </NavLink>
      <span className={`${iconWrapperClass} icon-thumbnail`}>{icon}</span>
      {children}
    </li>
  );
};

Component.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  icon: PropTypes.node,
  iconWrapperClass: PropTypes.string,
  activeStyle: PropTypes.object,
  end: PropTypes.bool,
};

export default Component;
