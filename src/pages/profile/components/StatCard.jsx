// Status card component
import React from 'react'

const StatCard = ({ icon, label, value, className }) => {
  return (
    <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-1 backdrop-blur-md transition-transform hover:scale-105 duration-300 ${className}`}>
      <div className="p-2 bg-white/10 rounded-xl mb-1">{icon}</div>
      <span className="text-3xl font-black">{value ?? 0}</span>
      <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{label}</span>
    </div>
  )
}

export default StatCard;