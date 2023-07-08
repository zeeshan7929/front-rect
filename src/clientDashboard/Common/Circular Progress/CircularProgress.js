import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = ({ percentage }) => {
  return (
    <CircularProgressbarWithChildren
      value={percentage}
      strokeWidth={13}
      styles={buildStyles({
        pathColor: "#9BB7C2",
        trailColor: "#C5C5C5",
      })}
    >
      <strong style={{ fontSize: "26px", color: "#9BB7C2" }}>
        {percentage}
        {"%"}
      </strong>
      <p style={{ textAlign: "center", fontSize: "14px", color: "#9BB7C2" }}>
        Training Tokens <br /> Used
      </p>
    </CircularProgressbarWithChildren>
  );
};

export default CircularProgress;
