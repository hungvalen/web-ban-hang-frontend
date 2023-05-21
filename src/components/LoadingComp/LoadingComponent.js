import React from "react";
import ReactLoading from "react-loading";

const LoadingComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: '50vh',
        width: '0 auto'
      }}>
      <ReactLoading type="spin" color="blue" />
    </div>
  );
};

export default LoadingComponent;
