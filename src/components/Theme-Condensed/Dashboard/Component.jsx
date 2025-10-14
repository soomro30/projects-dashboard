import React from "react";

import ContentWrapperComponent from "./Content";

const Component = ({ userRole }) => {
  let path = location.pathname;

  return (
    <>
      {/* START PAGE CONTENT WRAPPER */}
      <ContentWrapperComponent path={path} userRole={userRole} />
      {/* END PAGE CONTENT WRAPPER */}
    </>
  );
};

export default Component;
