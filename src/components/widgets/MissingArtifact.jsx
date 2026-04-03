import React from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MissingArtifact = ({
  title = "Object Not Found",
  message = "The digital artifact you're looking for has drifted out of reach.",
  linkText = "Return to Safety",
  linkTo = "/documents",
  className = ""
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-8 overflow-hidden rounded-[2rem] bg-slate-950/40 border border-white/5 ${className}`}>

      {/* 1. Background Blobs (Scaled down for widget size) */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px] animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-[60px]" />

      {/* 2. Glass Container */}
      <div className="relative z-10 flex flex-col items-center text-center w-full">

        {/* Icon with glow */}
        <div className="relative inline-block mb-4">
          <XCircle size={48} className="text-error/70 relative z-10" />
          <div className="absolute inset-0 bg-error/20 blur-xl rounded-full" />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">
          {title}
        </h3>

        <p className="text-slate-400 text-xs mb-6 font-medium max-w-[240px]">
          {message}
        </p>

        {/* Action Button */}
        <Link
          to={linkTo}
          className="btn btn-primary btn-sm px-6 rounded-xl border-none hover:scale-105 transition-transform duration-200 text-[10px] font-black uppercase tracking-widest"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default MissingArtifact;