import React from "react";

/* Components */
import Navbar from "../../modules/nav";

const GeneralLayout = ({ children }: any) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default GeneralLayout;
