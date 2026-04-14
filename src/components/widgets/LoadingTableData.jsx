import React from "react";

const LoadingTableData = ({ message = "Loading data..." }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-base-100">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingTableData;