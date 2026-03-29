import { Zap, Github, Linkedin, Twitter, Mail, Globe, ExternalLink, MapPin } from "lucide-react";

const LINKS = [
  { name: "Docs", url: "#" },
  { name: "API Reference", url: "#" },
  { name: "System Status", url: "#" },
  { name: "Privacy Policy", url: "#" },
  { name: "Terms of Service", url: "#" },
];

const SOCIALS = [
  { icon: Github, label: "GitHub", url: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-base-300 bg-base-100 pt-20 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-primary-content fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight text-base-content">
                SAP <span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-sm text-base-content/60 leading-relaxed max-w-xs">
              The professional standard for document lifecycle management and secure versioning.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, url }) => (
                <a 
                  key={label} 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-base-content hover:bg-primary hover:text-primary-content transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Resources</h4>
            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.url} className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center group">
                    {link.name}
                    <ExternalLink size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Info */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Support</h4>
            <div className="space-y-4">
              <a href="mailto:support@saphub.com" className="group block p-4 rounded-2xl bg-base-200 border border-base-300 hover:border-primary transition-all duration-300">
                <span className="text-xs text-base-content/40 block mb-1">Direct Support</span>
                <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">support@saphub.com</span>
              </a>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 w-fit">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">Live System Online</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── CONTRIBUTORS & BOTTOM BAR ── */}
        <div className="pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-base-content/40 uppercase tracking-[0.3em]">
              © 2026 SAP Hub Systems
            </div>
            <p className="text-[11px] text-base-content/50 leading-relaxed">
              This project was created by <span className="font-bold text-base-content/80 underline decoration-primary/30">Jewel Shahi, Alexander Iliev, Alexander Ivanov, Plamen, and Krasi.</span>
            </p>
          </div>
          
          <div className="px-4 py-1.5 rounded-full border border-base-300 bg-base-200 text-[9px] font-black text-base-content/40 uppercase tracking-widest">
            SAP Innovation Release
          </div>
        </div>
      </div>
    </footer>
  );
}