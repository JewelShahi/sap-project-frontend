import { Link } from "react-router-dom";
import { FileText, Users, AlertTriangle, CheckCircle } from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import GlassCards from "./components/GlassCard.jsx";
import Badges from "./components/Badges.jsx";
import FileStatus from "./components/FileStatus.jsx";

const statsData = [
  { label: "Documents", value: 42, icon: FileText, color: "text-primary" },
  { label: "Awaiting Review", value: 7, icon: AlertTriangle, color: "text-warning" },
  { label: "Approved", value: 28, icon: CheckCircle, color: "text-success" },
  { label: "Team Members", value: 5, icon: Users, color: "text-accent" },
];

const HomePage = () => {
  return (
    <div className="space-y-16 px-6 pb-12 pt-24"> {/* added pt-24 for navbar spacing */}

      {/* ── Dashboard Title ─────────────────── */}
      <Animate variant="fade-down">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Your Dashboard
          </h1>
          <p className="text-base-content/60 text-lg">
            Quick overview of your documents, team, and pending tasks.
          </p>
        </div>
      </Animate>

      {/* ── Quick Stats ─────────────────────── */}
      <Animate>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {statsData.map((stat) => (
            <div
              key={stat.label}
              className="card bg-base-200/70 backdrop-blur border border-base-300/40 p-6 flex flex-col items-center justify-center gap-2 hover:scale-[1.03] transition cursor-pointer"
            >
              <stat.icon size={28} className={`${stat.color}`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-base-content/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </Animate>

      {/* ── Documents ───────────────────────── */}
      <Animate>
        <div className="max-w-6xl mx-auto space-y-4">
          <h2 className="text-sm font-semibold uppercase text-base-content/50">Your Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="card bg-base-200/70 backdrop-blur border border-base-300/40 p-5 hover:scale-[1.02] transition cursor-pointer flex flex-col justify-between"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-center">Document {i}</p>
                  <p className="text-xs text-base-content/50 flex items-center gap-2 justify-center">
                    Version 1.2 • PDF • Status: <FileStatus status="pending" />
                  </p>
                </div>
                <span className="text-xs text-base-content/40 mt-3 text-center">2d ago</span>
              </div>
            ))}
          </div>
        </div>
      </Animate>

      {/* ── Glass Cards / Quick Actions ─────── */}
      <Animate>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold uppercase text-base-content/50 mb-4 text-center">Quick Actions</h2>
          <div className="flex justify-center">
            <GlassCards />
          </div>
        </div>
      </Animate>

    </div>
  );
};

export default HomePage;