import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      className="border border-[#767676] p-2 rounded-md w-full"
    />
  );
};

export default Input;