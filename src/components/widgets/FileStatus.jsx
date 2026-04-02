import React from "react";

const FileStatus = ({ status }) => {
  const colors = {
    approved: "#22C55E",
    pending: "#FBBF24",
    rejected: "#EF4444",
    default: "#888",
  };

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full`}
      style={{
        backgroundColor: colors[status.toLowerCase()] || colors.default,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default FileStatus;