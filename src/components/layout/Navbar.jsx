import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, Zap, File, ClipboardCheck, NotepadText, Menu, X, MonitorCog, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import notify from "@/components/toaster/notify";

const NAV_LINKS = [
  { icon: NotepadText, label: "About", to: "/getting-started" },
  { icon: File, label: "Documents", to: "/" },
  { icon: ClipboardCheck, label: "Reviews", to: "/reviews" },
  { icon: MonitorCog, label: "Admin", to: "/admin" },
];

const BREAKPOINT = 1000;

export default function Navbar({ theme, toggleTheme }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = isAuthenticated;
  const avatarSrc = user?.avatar ?? "/avatar.png";

  const handleLogout = () => {
    notify.success("Signed out successfully");
    setMenuOpen(false);
    setTimeout(() => {
      logout();
    }, 800);
  };

  // Auto-close menu if screen resizes above 1000px
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    const handler = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Only allow toggling if strictly under 1000px
  const toggleMenu = () => {
    if (window.innerWidth < BREAKPOINT) {
      setMenuOpen(prev => !prev);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-[100] w-full overflow-x-hidden">
      <div className="relative w-full h-20 border-b border-white/10 bg-base-300/50 backdrop-blur-2xl flex items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="w-full max-w-[1440px] mx-auto px-8 flex items-center justify-between">

          {/* ── Brand (Always Far Left) ── */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap size={18} className="text-primary-content fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight text-base-content hidden sm:block">
              SAP <span className="text-primary">Hub</span>
            </span>
          </div>

          {/* ── Desktop Nav Links (Shows > 1000px, pushes right side to edge) ── */}
          <div className="hidden min-[1000px]:flex flex-1 items-center gap-2 ml-12">
            {NAV_LINKS.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 ${
                    isActive ? "text-primary bg-primary/5" : "text-base-content/40 hover:text-base-content hover:bg-white/[0.05]"
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-base-content/40 hover:text-primary transition-all shrink-0"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* ── Desktop Right UI (Shows > 1000px) ── */}
            <div className="hidden min-[1000px]:flex items-center gap-3">
              <div className="w-[1px] h-8 bg-white/5" />

              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/40 hover:text-error transition-colors whitespace-nowrap"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                  <NavLink to="/profile" className="group relative">
                    <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-b from-white/20 to-transparent">
                      <div className="w-full h-full rounded-full overflow-hidden border border-black/20">
                        <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                    </div>
                  </NavLink>
                </div>
              ) : (
                <>
                  <NavLink to="/login" className="px-4 py-2 rounded-xl text-sm font-bold text-base-content/60 hover:text-base-content transition-all whitespace-nowrap">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-content shadow-lg shadow-primary/20 transition-all whitespace-nowrap">
                    Register
                  </NavLink>
                </>
              )}
            </div>

            {/* ── Hamburger Button (Hidden > 1000px) ── */}
            <button 
              className="min-[1000px]:hidden w-11 h-11 flex items-center justify-center rounded-2xl shrink-0" 
              onClick={toggleMenu}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Overlay (Hidden > 1000px) ── */}
      <div 
        className={`fixed inset-0 z-[99] min-[1000px]:hidden transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: theme === "dark" ? "rgba(var(--b3), 0.8)" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex flex-col h-full pt-20 px-8 relative overflow-y-auto">
          
          {/* Close X Button */}
          <button 
            onClick={closeMenu} 
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition z-10"
          >
            <X size={22} />
          </button>

          {/* Mobile Nav Links */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {NAV_LINKS.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMenu} 
                className={({ isActive }) =>
                  `flex items-center gap-4 text-xl font-bold px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-base-content/50 hover:text-base-content hover:bg-white/5" 
                  }`
                }
              >
                <Icon size={22} /> <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Bottom Menu */}
          <div className="pb-10 pt-4 border-t border-white/[0.06]">
            {isLoggedIn ? (
              <div className="flex items-center justify-between">
                <NavLink to="/profile" onClick={closeMenu} className="flex items-center gap-3 text-base-content/70 hover:text-base-content transition">
                  <img src={avatarSrc} className="w-11 h-11 rounded-full object-cover" alt="Profile" />
                  <span className="font-bold">{user?.username || "Profile"}</span>
                </NavLink>
                <button onClick={handleLogout} className="p-3 text-error hover:bg-error/10 rounded-xl transition">
                  <LogOut />
                </button>
              </div>
            ) : (
              <div className="flex gap-4 text-base-content/60">
                <NavLink to="/login" onClick={closeMenu} className="flex-1 text-center py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition">Login</NavLink>
                <NavLink to="/register" onClick={closeMenu} className="flex-1 text-center py-3 bg-primary text-primary-content rounded-xl font-bold transition">Register</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}