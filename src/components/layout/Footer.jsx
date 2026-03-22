import { Zap, Github, Linkedin, Twitter, Mail } from "lucide-react";

const LINKS = ["Docs", "API", "Status", "Privacy", "Terms"];
const SOCIALS = [
  { icon: Github, label: "GitHub", url: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
];

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Branding / Version */}
        <div className="flex flex-col gap-2 text-sm text-base-content/60">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Zap size={10} className="text-primary-content" />
            </div>
           <span className="text-base-content/60">
            SAP VersionHub · <span className="text-primary font-semibold">v1.0.0</span>
          </span>
          </div>
          <span className="text-xs">© 2026 SAP SE. All rights reserved.</span>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-1 text-sm text-base-content/60">
          <span className="font-semibold uppercase text-base-content/80 mb-1">Quick Links</span>
          {LINKS.map((l) => (
            <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
          ))}
        </div>

        {/* Contact / Social */}
        <div className="flex flex-col gap-2 text-sm text-base-content/60">
          <span className="font-semibold uppercase text-base-content/80 mb-1">Get in Touch</span>
          <a href="mailto:support@saphub.com" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Mail size={14} /> support@saphub.com
          </a>
          <div className="flex items-center gap-3 mt-1">
            {SOCIALS.map(({ icon: Icon, label, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-primary transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Optional Mini-map / Location */}
        <div className="flex flex-col gap-1 text-sm text-base-content/60">
          <span className="font-semibold uppercase text-base-content/80 mb-1">Office</span>
          <p>123 SAP Street, Berlin, Germany</p>
          <div className="w-full h-20 rounded-lg overflow-hidden border border-base-300 mt-1">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.2900171151543!2d13.375738!3d52.525784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851e7e92b8d57%3A0x8e0d448e11a39a03!2sBerlin!5e0!3m2!1sen!2sde!4v1689744444444!5m2!1sen!2sde"
              title="Office Location"
            />
          </div>
        </div>

      </div>
    </footer>
  );
}