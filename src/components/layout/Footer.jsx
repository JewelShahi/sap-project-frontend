import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Zap, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canAccessReviews } from "@/utils/canAccessReviews";

const RESOURCE_LINKS = [
  { name: "Home", url: "/", public: true },
  { name: "Documents", url: "/documents", protected: true },
  { name: "Reviews", url: "/reviews", protected: true, reviewsOnly: true },
  { name: "Users", url: "/manage-users", adminOnly: true },
  { name: "Audit Log", url: "/audit-log", adminOnly: true },
];

const LEGAL = [
  { name: "Privacy Policy", url: "#" },
  { name: "Terms of Service", url: "#" },
  { name: "Cookie Policy", url: "#" },
];

const TEAM = [
  { name: "Jewel Shahi", url: "https://github.com/JewelShahi" },
  { name: "Plamen Nikolov", url: "https://github.com/plamennf" },
  { name: "Alexander Iliev", url: "https://github.com/TheGitlex" },
  { name: "Alexander Ivanov", url: "https://github.com/Aleksandar-coder" },
  { name: "Krasimir Milanov", url: "https://github.com/milanov966" },
];

const Footer = () => {
  const { user, isAuthenticated } = useAuth();

  const filteredResources = RESOURCE_LINKS.filter(link => {
    if (!isAuthenticated) return link.public;
    if (link.adminOnly && !user?.is_superuser && !user?.is_staff) return false;
    if (link.reviewsOnly && !canAccessReviews(user)) return false;
    return true;
  });

  return (
    <footer className="relative w-full border-t border-base-300 bg-base-200/50 backdrop-blur-md text-base-content pt-16 pb-8 transition-all duration-500 shadow-[0_-15px_25px_-5px_rgba(0,0,0,0.1)]">
      <div className="w-full mx-auto px-6">

        {/* Main Grid: Reduced gap and bottom margin */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center md:text-left w-full">

          {/* 1. Branding Section */}
          <div className="flex flex-col items-center space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content transition-transform duration-500 group-hover:rotate-[10deg]">
                <Zap size={18} className="fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight">
                SAP <span className="text-primary not-italic">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-base-content/60 leading-relaxed max-w-[240px] text-center">
              The professional standard for document lifecycle management and secure versioning.
            </p>
          </div>

          {/* 2. Resources: Reduced vertical spacing between links */}
          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Resources</h4>
            <ul className="space-y-2 flex flex-col items-center md:items-start">
              {filteredResources.map((link) => (
                <li key={link.name} className="leading-none">
                  <NavLink
                    to={link.url}
                    className={({ isActive }) =>
                      `group relative inline-block py-0.5 text-sm font-medium transition-all hover:text-primary ${isActive ? "text-primary" : "text-base-content/60"
                      }`
                    }
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company/Legal: Reduced vertical spacing */}
          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Company</h4>
            <ul className="space-y-2">
              {LEGAL.map((link) => (
                <li key={link.name} className="leading-none">
                  <a href={link.url} className="inline-block py-0.5 text-sm font-medium text-base-content/60 transition-colors hover:text-primary">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Support Info */}
          <div className="flex flex-col items-center space-y-4 w-full">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Support
            </h4>

            {/* Inner Wrapper: Removed md:items-start to maintain centering on desktop */}
            <div className="space-y-3 flex flex-col items-center">

              {/* Email Link: Added justify-center and mx-auto */}
              <a
                href="mailto:support@saphub.com"
                className="group flex items-center justify-center gap-3 p-3 rounded-xl bg-base-100 border border-base-300 transition-all duration-300 hover:border-primary/50 hover:shadow-lg w-full max-w-xs mx-auto"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Mail size={16} />
                </div>
                <div className="min-w-0 text-left"> {/* Kept text-left for the labels, but the container is centered */}
                  <span className="block text-[9px] font-bold uppercase text-base-content/40 tracking-tight">
                    Get in touch
                  </span>
                  <span className="block text-xs font-bold truncate">
                    support@saphub.com
                  </span>
                </div>
              </a>

              {/* Status Badge: Ensure justify-center and w-fit with mx-auto */}
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/10 w-fit mx-auto">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                </span>
                <div className="text-[9px] font-bold text-success uppercase tracking-wider">
                  Systems Operational
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar: Tightened padding */}
        <div className="pt-6 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} SAP Hub
            </span>
            <p className="text-[10px] text-base-content/50">
              Created by{" "}
              {TEAM.map((member, index) => (
                <React.Fragment key={member.name}>
                  <a href={member.url} target="_blank" rel="noreferrer" className="text-base-content/80 hover:text-primary font-bold transition-colors">
                    {member.name}
                  </a>
                  {index < TEAM.length - 2 ? ", " : index === TEAM.length - 2 ? " & " : ""}
                </React.Fragment>
              ))}.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black text-base-content/40 uppercase tracking-widest bg-base-300/30 px-3 py-1 rounded-full border border-base-300">
              v1 - stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;