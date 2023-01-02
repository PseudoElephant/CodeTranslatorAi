import Link from "next/link";
import React, { ReactNode } from "react";
import SpinnerLoader from "../spinner";

type Props = {
  onClick?: () => void;
  children: ReactNode;
  loading?: boolean;
};

const ActionButton = ({ children, onClick, loading }: Props) => {
  return (

    <div className="py-1 px-1 bg-primary-9 text-primary-12 rounded truncate text-sm hover:bg-primary-10 flex items-center w-full justify-center"
        onClick={onClick}
    >
    {loading ?  <SpinnerLoader size="small" className="fill-gray-12 text-gray-9"/> : children}
    </div>
  );
};

export default ActionButton;
