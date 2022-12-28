import Link from "next/link";
import React, { ReactNode } from "react";

type Button = {
  link: string;
  children: ReactNode;
};

const Button = ({ children, link }: Button) => {
  return (
    <Link
      href={`/${link}`}
      className="py-2 px-5 bg-primary-11 text-primary-1 rounded text-sm"
    >
      {" "}
      {children}
    </Link>
  );
};

export default Button;
