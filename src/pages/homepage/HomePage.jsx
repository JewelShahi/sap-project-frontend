import { Link } from "react-router-dom";
import Animate from "@/components/animation/Animate.jsx";
import { 
  FileText, ShieldCheck, Users, Zap, 
  ArrowRight, CheckCircle, Lock, Cpu, Globe,
  RefreshCw, Layers, HardDrive, Search, Terminal
} from "lucide-react";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import BackgroundEffects from "@/components/background/BackgroundEffects.jsx";

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 text-center py-20 overflow-hidden bg-base-100">
      
      {/* ── BACKGROUND LAYER ── */}
      <BackgroundEffects length={12} />

      {/* Dynamic Glows */}
      <div className="absolute w-[800px] h-[800px] bg-primary/5 blur-[140px] rounded-full top-[-300px] left-[50%] translate-x-[-50%] -z-10" />
      <div className="absolute w-[600px] h-[600px] bg-secondary/5 blur-[140px] rounded-full bottom-[10%] left-[-10%] -z-10" />
      <div className="absolute w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full top-[40%] right-[-5%] -z-10" />

      {/* ── HERO SECTION ── */}
      <Animate variant="fade-down">
        <div className="space-y-6 max-w-3xl relative z-10 mb-20 pt-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap size={22} fill="white" className="text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">
              SAP <span className="text-primary">Hub</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-base-content leading-[1.1]">
            Document Control <br />
            <span className="text-primary">Reinvented.</span>
          </h1>

          <p className="text-base-content/60 text-sm md:text-xl leading-relaxed max-w-xl mx-auto font-light">
            The professional standard for version-controlled document lifecycles. 
            Automate approvals, audit every change.
          </p>
        </div>
      </Animate>

      {/* ── METRICS BANNERS ── */}
      <Animate variant="fade-up" delay={0.2}>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-32 py-10 border-y border-base-content/5 w-full max-w-6xl relative z-10">
          {[
            { label: "Uptime SLA", val: "99.99%" },
            { label: "Encryption", val: "AES-256" },
            { label: "Global Nodes", val: "24" },
            { label: "File Support", val: "100+" }
          ].map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-base-content">{m.val}</div>
              <div className="text-xs uppercase tracking-widest text-base-content/40 font-bold mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </Animate>

      {/* ── CORE FEATURES ── */}
      <Animate variant="fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl relative z-10">
          <GlassCard bg="bg-primary/5" border="border-primary/20">
            <RefreshCw className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="font-bold text-xl mb-2">Granular Versioning</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Every save creates a delta. Compare versions side-by-side and rollback to any point in time with a single click.
            </p>
          </GlassCard>

          <GlassCard bg="bg-success/5" border="border-success/20">
            <ShieldCheck className="mx-auto mb-4 text-success" size={32} />
            <h3 className="font-bold text-xl mb-2">Audit-Ready Security</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Full chain of custody tracking. Know exactly who viewed, edited, or approved a document and when.
            </p>
          </GlassCard>

          <GlassCard bg="bg-warning/5" border="border-warning/20">
            <Users className="mx-auto mb-4 text-warning" size={32} />
            <h3 className="font-bold text-xl mb-2">Smart Workflows</h3>
            <p className="text-sm text-base-content/60 leading-relaxed">
              Define custom approval logic. Parallel or sequential reviews ensure your documents meet quality standards.
            </p>
          </GlassCard>
        </div>
      </Animate>

      {/* ── GIT-STYLE VERSION TIMELINE VISUAL ── */}
      <div className="mt-40 max-w-4xl w-full relative z-10">
        <Animate variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold mb-4">Version control for Documents</h2>
            <p className="text-base-content/50 text-lg">Sophisticated version history, simplified for business.</p>
          </div>
          
          <div className="bg-base-200/40 rounded-3xl p-8 border border-base-content/5 backdrop-blur-xl text-left">
            <div className="space-y-8 relative">
              <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-primary/20" />
              
              {[
                { user: "Sarah K.", action: "Initial Draft Uploaded", time: "2 hours ago", version: "v1.0.0", icon: <FileText size={18}/> },
                { user: "System", action: "OCR & Metadata Extraction", time: "1 hour ago", version: "v1.0.1", icon: <Cpu size={18}/> },
                { user: "Alex M.", action: "Reviewer Comment: 'Update Clause 4'", time: "45 mins ago", version: "v1.1.0-rc", icon: <Users size={18}/> },
                { user: "Director", action: "Document Finalized & Signed", time: "Now", version: "v2.0.0", active: true, icon: <CheckCircle size={18}/> }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-6 relative group">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-base-100 shadow-sm z-10 transition-all ${step.active ? 'bg-primary text-white scale-110' : 'bg-base-300 text-base-content/40 group-hover:border-primary/30'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold text-lg ${step.active ? 'text-primary' : 'text-base-content'}`}>{step.action}</span>
                      <span className="text-xs font-mono bg-base-300/50 px-2 py-1 rounded-md text-base-content/50 border border-base-content/5">{step.version}</span>
                    </div>
                    <p className="text-sm text-base-content/50">Modified by <span className="text-base-content/80 font-medium">{step.user}</span> • {step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Animate>
      </div>

      {/* ── TECHNICAL GRID ── */}
      <div className="mt-40 w-full max-w-6xl relative z-10">
        <Animate variant="fade-left">
          <div className="text-center mb-16 px-4">
            <h2 className="text-5xl font-extrabold mb-4">Enterprise Infrastructure</h2>
            <p className="text-center text-base-content/50 max-w-2xl mx-auto">Built for scale, speed, and uncompromising reliability. Manage millions of documents without breaking a sweat.</p>
          </div>
        </Animate>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Layers />, title: "Delta Storage", desc: "Optimized binary diffing reduces storage costs by 80%." },
            { icon: <HardDrive />, title: "Immutable Vault", desc: "Write-once-read-many (WORM) storage for compliance." },
            { icon: <Search />, title: "Elastic Search", desc: "Search through millions of PDFs and images in milliseconds." },
            { icon: <Terminal />, title: "API First", desc: "Full REST API access to integrate with your existing ERP." }
          ].map((item, idx) => (
            <Animate key={idx} variant="fade-up" delay={idx * 0.1}>
              <div className="p-6 text-left border-l border-base-content/10 hover:border-primary transition-colors">
                <div className="text-primary mb-4">{item.icon}</div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
              </div>
            </Animate>
          ))}
        </div>
      </div>

      {/* ── FINAL CALL TO ACTION ── */}
      <div className="mt-48 mb-20 w-full max-w-5xl relative z-10">
        <Animate variant="zoom-in">
          <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-12 rounded-[2rem] border border-primary/20 text-center relative overflow-hidden">
             {/* Decorative element */}
            <div className="absolute top-0 right-0 p-8 opacity-10 text-primary">
              <Zap size={120} fill="text-primary"/>
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to fix your <br/> document workflow?</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto mb-10">
              Join the hundreds of teams managing their document lifecycle with SAP Hub. 
              Deploy in minutes, scale forever.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login" className="btn btn-primary btn-lg px-12 rounded-2xl shadow-xl shadow-primary/20 border-base-content/50 hover:border-primary hover:bg-primary/50">
                Create Free Account
              </Link>
              <button className="btn btn-outline btn-lg rounded-2xl border-base-content/20">
                Contact Sales
              </button>
            </div>
          </div>
        </Animate>
      </div>

    </div>
  );
};

export default HomePage;