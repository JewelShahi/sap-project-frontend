import React from 'react'

const Loader = ({ message = "Loading" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <div className="relative flex items-center justify-center">
        {/* Main Spinner - Increased size using w-24 h-24 */}
        <span className="loading loading-spinner text-primary w-20 h-20"></span>
      </div>
      {/* Message with improved spacing and entrance animation */}
      <div className="mt-8 text-center animate-pulse">
        <p className="text-xs font-black tracking-[0.5em] uppercase text-secondary/70">
          {message}
        </p>
      </div>
    </div>
  )
}

export default Loader