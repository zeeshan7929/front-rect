import React from "react";

export const ErrorText = (props) => {
  return (
    <div className="mt-1 text-danger">
      <p>{props.children}</p>
    </div>
  );
};
