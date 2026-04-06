import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Check, ArrowRight, CheckCircle2,
  MailOpen, Search, AlertCircle, Clock, ShieldAlert
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";
import Loader from "@/components/widgets/Loader.jsx";
import { useAuth } from "@/context/AuthContext";

const FILTERS = ["all", "unread", "read"];

const NOTIFICATION_TYPES = {
  access: { icon: ShieldAlert, color: "secondary", bg: "bg-secondary/10", label: "Permission" },
  approval: { icon: CheckCircle2, color: "success", bg: "bg-success/10", label: "Registry" },
  default: { icon: Bell, color: "primary", bg: "bg-primary/10", label: "System" }
};

const getNotifyConfig = (verb) => {
  const v = verb?.toLowerCase() || "";
  if (v.includes("access")) return NOTIFICATION_TYPES.access;
  if (v.includes("approv") || v.includes("grant")) return NOTIFICATION_TYPES.approval;
  return NOTIFICATION_TYPES.default;
};

const ViewAllNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/");
      const data = res.data?.notifications || [];
      setNotifications(Array.isArray(data) ? data : []);
      setUnreadCount(res.data?.unread_count || 0);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.post("/notifications/mark-all-read/");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesFilter =
        filter === "all" ? true :
          filter === "unread" ? !n.is_read : n.is_read;

      const content = `${n.user_username} ${n.verb} ${n.target_document_title || ""}`.toLowerCase();
      return matchesFilter && content.includes(search.toLowerCase());
    });
  }, [notifications, filter, search]);

  if (loading) return <Loader message="Decrypting notification stream..." />;

  return (
    <div className="min-h-screen bg-base-100 px-6 pb-20 pt-20 overflow-hidden">

      {/* Header */}
      <Animate variant="fade-down">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Bell size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Full Archive</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
              Hello, <span className="text-primary">{user?.first_name || "Agent"}</span>
            </h1>
            <p className="text-secondary font-medium max-w-md opacity-60">Manage all your notifications in one place.</p>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`btn rounded-2xl border-none px-8 transition-all ${unreadCount === 0 ? 'btn-disabled opacity-30' : 'btn-primary hover:scale-105'}`}
          >
            <MailOpen size={20} /> Mark All Read
          </button>
        </div>
      </Animate>

      {/* Toolbar */}
      <Animate>
        <div className="max-w-7xl mx-auto mb-8 rounded-2xl border border-base-300/30 bg-base-200/40 backdrop-blur-md overflow-hidden p-2 lg:p-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="grid grid-cols-3 lg:flex gap-1 w-full lg:w-auto">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`btn btn-xs sm:btn-sm rounded-xl px-5 border-none uppercase text-[9px] lg:text-[10px] font-black tracking-widest ${filter === f ? "btn-primary" : "btn-ghost text-secondary hover:bg-base-300"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-[280px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
              <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)} className="input w-full pl-12 bg-base-100/50 border-base-300/30 focus:border-primary rounded-2xl" />
            </div>
          </div>
        </div>
      </Animate>

      {/* Table Content */}
      <Animate variant="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[1.25rem] border border-base-300/30 bg-base-200/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="w-full overflow-x-auto">
              {filteredNotifications.length > 0 ? (
                <table className="table w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-base-300/90 text-secondary uppercase text-[11px] font-black">
                      <th className="py-6 px-10">Issuer & Event</th>
                      <th className="text-center">Category</th>
                      <th className="text-center">State</th>
                      <th className="text-right px-10">Logged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300/5">
                    {filteredNotifications.map((n) => {
                      const config = getNotifyConfig(n.verb);
                      const dateObj = new Date(n.created_at || Date.now());
                      return (
                        <tr key={n.id} className={`hover:bg-primary/5 transition-colors group ${!n.is_read ? 'bg-primary/5' : 'bg-success/5'}`}>
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-4">
                              <div className="avatar">
                                <div className="w-10 h-10 rounded-full ring ring-primary/10 group-hover:scale-110 group-hover:ring-primary/40 transition-all duration-300 overflow-hidden">
                                  <img src={n.user_avatar} alt="user" className="object-cover w-full h-full" />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-base-content leading-tight">
                                  <span className="text-primary font-black  tracking-tight">{n.user_username}</span> {n.verb}
                                  <span className="ml-1 text-base-content/80 font-black italic underline decoration-primary/30">
                                    {n.target_document_title}
                                  </span>
                                </span>
                                {(n.target_document_id) && (
                                  <Link to={`/documents/${n.target_document_id}`} className="text-[10px] text-primary font-black uppercase flex items-center gap-1 mt-1 hover:gap-2 transition-all">
                                    Access Record <ArrowRight size={10} />
                                  </Link>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className={`text-[10px] font-black uppercase tracking-widest text-${config.color}`}>{config.label}</span>
                          </td>
                          <td className="text-center">
                            {!n.is_read ? (
                              <button onClick={() => markAsRead(n.id)} className="btn btn-xs btn-ghost text-success gap-1 font-black text-[9px] border border-success/20 rounded-lg uppercase">
                                <Check size={12} /> Resolve
                              </button>
                            ) : (
                              <span className="text-[9px] font-bold opacity-30 uppercase">Archived</span>
                            )}
                          </td>
                          <td className="text-right px-10 text-[11px] opacity-60">
                            <div className="flex flex-col items-end font-mono">
                              <span className="font-bold whitespace-nowrap">{dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              <span className="text-[9px] uppercase">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-20 gap-4 text-center">
                  <AlertCircle size={80} strokeWidth={1} />
                  <p className="text-xl font-black uppercase tracking-[0.3em]">Notifications Detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Animate>
    </div>
  );
};

export default ViewAllNotifications;