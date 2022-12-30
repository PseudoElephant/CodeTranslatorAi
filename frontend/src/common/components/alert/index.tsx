import React, { ReactNode } from "react";

type Alert = {
  heading: string;
  children: ReactNode;
};

const Alert = ({ heading, children }: Alert) => {
  return (
    <div className="p-6 bg-primary-3 text-primary-11 border-primary-6 border border-1 rounded-md text-center">
      <span className="font-bold">{heading}: </span>
      {children}
    </div>
  );
};

export default Alert;
