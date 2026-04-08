import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  const ref = useRef(null);

  const promote = () => {
    const el = ref.current;
    if (!el) return;
    try { el.hidePopover(); } catch {}
    el.showPopover();
  };

  useEffect(() => {
    promote();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeName === "DIALOG") setTimeout(promote, 0);
        }
        if (
          mutation.type === "attributes" &&
          mutation.target.nodeName === "DIALOG" &&
          mutation.target.open
        ) {
          setTimeout(promote, 0);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });

    return () => observer.disconnect();
  }, []);

  return createPortal(
    <div
      ref={ref}
      popover="manual"
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
        overflow: "visible",
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    >
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ pointerEvents: "none" }}
        toastOptions={{
          duration: 3000,
          style: {
            pointerEvents: "all",
            background: "var(--color-base-200)",
            color: "#ffffff",
            border: "1px solid var(--color-base-300)",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "500",
          },
          success: {
            style: { pointerEvents: "all", background: "#16A34Af2", color: "#ffffff", border: "1px solid #15803D" },
            iconTheme: { primary: "#ffffff", secondary: "#16A34A" },
          },
          error: {
            style: { pointerEvents: "all", background: "#DC2626f2", color: "#ffffff", border: "1px solid #B91C1C" },
            iconTheme: { primary: "#ffffff", secondary: "#DC2626" },
          },
          warning: {
            style: { pointerEvents: "all", background: "#D97706f2", color: "#ffffff", border: "1px solid #B45309" },
            iconTheme: { primary: "#ffffff", secondary: "#D97706" },
          },
          info: {
            style: { pointerEvents: "all", background: "#2563EBf2", color: "#ffffff", border: "1px solid #1D4ED8" },
            iconTheme: { primary: "#ffffff", secondary: "#2563EB" },
          },
          loading: {
            style: { pointerEvents: "all", background: "#475569f2", color: "#ffffff", border: "1px solid #334155" },
            iconTheme: { primary: "#ffffff", secondary: "#475569" },
          },
        }}
      />
    </div>,
    document.body
  );
};

export default ToastProvider;