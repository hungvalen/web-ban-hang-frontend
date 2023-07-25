import React from "react";

const NoDataFound = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 className="text-xl">{message != null ? '' : 'No Data Found.'}</h1>
    </div>
  );
};

export default NoDataFound;
