import React from "react";

import ContentWrapperComponent from "./Content";

const Component = ({ userRole }) => {
  let path = location.pathname;

  return (
    <div
      className={
        path.includes("/executive") || path.includes("/casual")
          ? "no-padding page-container"
          : "page-container"
      }
    >
      {/* START PAGE CONTENT WRAPPER */}
      <ContentWrapperComponent path={path} userRole={userRole} />
      {/* END PAGE CONTENT WRAPPER */}
    </div>
  );
};

export default Component;
