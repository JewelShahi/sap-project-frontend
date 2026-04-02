// Reuseable popup modal component
import React from "react";
import { X } from "lucide-react"

const Modal = ({ id, title, children }) => {
  return (
    <dialog id={id} className="modal backdrop-blur-md">
      <div className="modal-box bg-base-200/80 border border-white/10 shadow-2xl max-w-lg">
        <h3 className="font-bold text-2xl mb-6 tracking-tight">{title}</h3>
        {children}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X /></button>
        </form>
      </div>
    </dialog>
  )
}

export default Modal;
