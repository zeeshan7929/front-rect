import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = ({ percentage , usage_renew , for_}) => {
  return (
    <CircularProgressbarWithChildren
      value={percentage}
      strokeWidth={13}
      styles={buildStyles({
        pathColor: for_ === "0" ? "#4A5C77" : "#9BB7C2",
        trailColor: "#C5C5C5",
      })}
    >
      <strong style={{ fontSize: "26px", color: for_ === "0" ? "#4A5C77" : "#9BB7C2" }}>
        {percentage}
        {"%"}
      </strong>
      <p style={{ textAlign: "center", fontSize: "14px", color: for_  === "0" ? "#4A5C77" : "#9BB7C2"}}>
      
       {for_ === "0" ? "Usage renews" : ""} {" "}{for_ === "0"? <br></br> : ""}
       <strong>{for_ === "0" ? usage_renew : ""}</strong>
       
       {for_ === "1" ? "Training Token Used" : ""}
      </p>
    </CircularProgressbarWithChildren>
  );
};

export default CircularProgress;
