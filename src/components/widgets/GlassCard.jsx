import React from "react";

const GlassCard = ({ children, bg = "bg-primary/10", border = "border-primary/20" }) => {
  return (
    <div
      className={`
        card
        backdrop-blur
        ${bg}
        border
        ${border}
        p-6
        shadow-md
        hover:scale-[1.02]
        transition
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;