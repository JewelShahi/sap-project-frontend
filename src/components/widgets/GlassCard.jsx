import React from "react";

const GlassCard = ({ 
  children, 
  bg = "bg-primary/10", 
  border = "border-primary/20",
  hover = true,
  className = ""
}) => {
  return (
    <div
      className={`
        card
        backdrop-blur-xl
        ${bg}
        border
        ${border}
        shadow-lg
        ${hover ? 'hover:scale-[1.02] hover:shadow-xl' : ''}
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
