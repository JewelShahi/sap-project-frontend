import { NavLink } from "react-router-dom";
import { Sun, Moon, Zap, File, ClipboardCheck, NotepadText, House } from "lucide-react";

const NAV_LINKS = [
  { icon: NotepadText, label: "About", to: "/getting-started" },
  { icon: File, label: "Documents", to: "/" },
  { icon: ClipboardCheck, label: "Reviews", to: "/reviews" },
];

export default function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="sticky top-0 z-[100] w-full">
      {/* The "Watery" Shell:
        1. bg-white/5 (low opacity for transparency)
        2. backdrop-blur-2xl (maximum blur for the liquid look)
        3. border-b-white/10 (subtle bottom edge)
        4. shadow-inner (adds depth to the "water" surface)
      */}
      <div className="relative w-full h-20 border-b border-white/10 bg-base-300/50 backdrop-blur-2xl transition-all duration-300 flex items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        
        <div className="w-full max-w-[1440px] mx-auto px-8 flex items-center justify-between">
          
          {/* ── Brand (Left) ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0 mr-12">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
              <Zap size={18} className="text-primary-content fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight text-base-content hidden sm:block">
              SAP <span className="text-primary">Hub</span>
            </span>
          </div>

          {/* ── Nav Links (Glass Tabs) ──────────────────────────────────────── */}
          <div className="flex flex-1 items-center gap-2">
            {NAV_LINKS.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 ${
                    isActive
                      ? "text-primary bg-primary/5 shadow-[inset_0_0_0_1px_rgba(var(--p),0.1)]" 
                      : "text-base-content/40 hover:text-base-content hover:bg-white/[0.05]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={`transition-all duration-500 ${isActive ? 'drop-shadow-[0_0_8px_rgba(var(--p),0.5)]' : 'group-hover:scale-110'}`} />
                    <span>{label}</span>

                    {/* Watery Ripple Highlight (Active) */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent opacity-50" />
                    )}
                    
                    {/* The Underline Glow */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full shadow-[0_0_15px_var(--p)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Right Side ────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Theme Toggle */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-base-content/40 hover:text-primary hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 active:scale-90"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="w-[1px] h-8 bg-white/5 hidden sm:block" />

            {/* Profile Circle */}
            <NavLink to="/profile" className="group relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-b from-white/20 to-transparent">
                <div className="w-full h-full rounded-full overflow-hidden border border-black/20">
                  <img
                    src="/avatar.png"
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                  />
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}