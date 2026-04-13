import React from "react";
import { Zap, Github, Linkedin, X, ExternalLink, Mail } from "lucide-react";

const LINKS = [
  { name: "Documentation", url: "#" },
  { name: "API Reference", url: "#" },
  { name: "System Status", url: "#", external: true },
  { name: "Community", url: "#" },
];

const LEGAL = [
  { name: "Privacy Policy", url: "#" },
  { name: "Terms of Service", url: "#" },
  { name: "Cookie Policy", url: "#" },
];

// Custom X icon component for a perfect match
const XIcon = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

const SOCIALS = [
  { icon: Github, label: "GitHub", url: "https://github.com", brandColor: "#24292f" },
  { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com", brandColor: "#0077b5" },
  { icon: XIcon, label: "X", url: "https://x.com", brandColor: "#000000" },
];

const TEAM = [
  { name: "Jewel Shahi", url: "https://github.com/search?q=Jewel+Shahi" },
  { name: "Alexander Iliev", url: "https://github.com/search?q=Alexander+Iliev" },
  { name: "Alexander Ivanov", url: "https://github.com/search?q=Alexander+Ivanov" },
  { name: "Plamen Nikolov", url: "https://github.com/search?q=Plamen+Nikolov" },
  { name: "Krasimir Milanov", url: "https://github.com/search?q=Krasimir+Milanov" },
];

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-base-300 bg-base-200/50 backdrop-blur-md text-base-content pt-20 pb-8 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* 1. Branding Section */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content transition-transform duration-500 group-hover:rotate-[10deg]">
                <Zap size={20} className="fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                SAP <span className="text-primary not-italic">Hub</span>
              </span>
            </div>

            <p className="text-sm text-base-content/60 leading-relaxed max-w-[240px] text-center sm:text-left">
              The professional standard for document lifecycle management and secure versioning.
            </p>

            {/* Social Icons with Brand Colors */}
            <div className="flex items-center gap-4 group/container p-2">
              {SOCIALS.map(({ icon: Icon, label, url, brandColor }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full border border-base-300 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden isolate"
                  style={{
                    backgroundColor: `${brandColor}4D`, // 30% default
                    '--hover-bg': brandColor
                  }}
                >
                  {/* Background Fill Layer - This prevents "shaking" vs changing parent bg directly */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 -z-10"
                    style={{
                      backgroundColor: 'var(--hover-bg)',
                    }}
                    inner-hover-target="true"
                  />

                  {/* Tailwind handles the hover state switch here */}
                  <style>{`
                    a:hover div[inner-hover-target] { opacity: 1; }
                  `}</style>

                  {/* The Icon */}
                  <Icon
                    size={20}
                    className="text-white z-10 transition-transform duration-500 group-hover:scale-110 will-change-transform"
                  />                  
                </a>
              ))}
            </div>
          </div>

          {/* 2. Resources */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Resources</h4>
            <ul className="space-y-4">
              {LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.url} className="group flex items-center text-sm font-medium text-base-content/60 transition-all hover:text-primary">
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    {link.external && <ExternalLink size={12} className="ml-2 opacity-40" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company/Legal */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Company</h4>
            <ul className="space-y-4">
              {LEGAL.map((link) => (
                <li key={link.name}>
                  <a href={link.url} className="text-sm font-medium text-base-content/60 transition-colors hover:text-primary">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Support Info */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">Support</h4>
            <div className="w-full space-y-4">
              <a href="mailto:support@saphub.com" className="group flex items-center gap-4 p-4 rounded-2xl bg-base-100 border border-base-300 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-bold uppercase text-base-content/40">Get in touch</span>
                  <span className="block text-sm font-bold truncate">support@saphub.com</span>
                </div>
              </a>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-success/5 border border-success/10 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">Systems Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-[10px] font-bold text-base-content/30 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} SAP Hub • Enterprise Grade
            </span>
            <p className="text-[11px] text-base-content/50">
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
            <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest bg-base-300/30 px-4 py-1.5 rounded-full border border-base-300">
              v1 - stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;