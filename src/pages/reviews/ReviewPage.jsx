import { Clock, XCircle, Search, FileCheck, ChevronLeft, ChevronRight, FilterX, AlertTriangle } from "lucide-react";
import Animate from "@/components/animation/Animate.jsx";
import { Link } from "react-router-dom";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import GlassCard from "@/components/widgets/GlassCard.jsx";
import Loader from "@/components/widgets/Loader.jsx"; // Import Full Page Loader
import LoadingTableData from "@/components/widgets/LoadingTableData"; // Import Table Overlay
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import api from "@/components/api/api";
import { useAuth } from "@/context/AuthContext";

const FILTERS = ["all", "pending", "approved", "rejected"];

const ICON_MAP = {
  pending: <Clock size={20} />,
  approved: <FileCheck size={20} />,
  rejected: <XCircle size={20} />,
  default: <AlertTriangle size={20} />,
};

const getReviewIcon = (status) => ICON_MAP[status] || ICON_MAP.default;

const ReviewPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // 1. isInitialLoading: Controls the Full Page Loader.
  //    Stays true until the VERY FIRST fetch completes successfully.
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 2. isTableUpdating: Controls the Table Overlay.
  //    Only true for filter/search/page changes AFTER the initial load.
  const [isTableUpdating, setIsTableUpdating] = useState(false);

  // UseRef to track if this is the absolute first mount.
  const isInitialMount = useRef(true);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Debounce Search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Data
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      // If this is NOT the first mount (e.g. user clicked a filter), show the table overlay.
      // If it IS the first mount, we keep isInitialLoading true (so the full page loader stays).
      if (!isInitialMount.current) {
        setIsTableUpdating(true);
      }

      try {
        // Fetch Reviews
        const res = await api.get("/reviews/inbox/?all=true", {
          signal: controller.signal,
        });

        const data = res.data || [];
        setReviews(data);

        // CRITICAL: Only turn off the full page loader here, inside the try block,
        // AFTER the data has been successfully fetched and set.
        if (isInitialMount.current) {
          isInitialMount.current = false;
          setIsInitialLoading(false);
        } else {
          // If it's not the initial mount, we finish the table update here
          setIsTableUpdating(false);
        }

      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Failed to fetch reviews:", err);
          // You could add a toast notification here
        }

        // ERROR HANDLING:
        // If this is an update (filter/page), we want to stop the spinner so the UI isn't frozen.
        if (!isInitialMount.current) {
          setIsTableUpdating(false);
        }
        // If this is the Initial Mount and it fails, we do NOT set isInitialLoading to false.
        // The user stays on the Full Page Loader.
      }
    };

    fetchData();
    return () => controller.abort();
  }, [filter, debouncedSearch, currentPage]); // Removed isInitialLoading from deps to prevent loops

  // Stats Data Calculation
  const statsData = useMemo(
    () => [
      {
        label: "Pending Reviews",
        val: reviews.filter((r) => r.review_status === "pending").length,
        icon: Clock,
        color: "warning",
        glass: "bg-warning/10",
      },
      {
        label: "Approved",
        val: reviews.filter((r) => r.review_status === "approved").length,
        icon: FileCheck,
        color: "success",
        glass: "bg-success/10",
      },
      {
        label: "Rejected",
        val: reviews.filter((r) => r.review_status === "rejected").length,
        icon: XCircle,
        color: "error",
        glass: "bg-error/10",
      },
    ],
    [reviews],
  );

  // Filtering Logic
  const filteredReviews = reviews.filter((r) => {
    const matchesFilter = filter === "all" || r.review_status === filter;
    const matchesSearch =
      (r.new_version?.document_title || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (r.new_version?.creator_name || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (r.comments || "").toLowerCase().includes(debouncedSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredReviews.length / PAGE_SIZE) || 1;
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (f) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // LOGIC: 
  // Show Full Page Loader ONLY if it is the initial load.
  if (isInitialLoading) {
    return <Loader message="Loading reviews..." />;
  }

  return (
    <div className="min-h-screen bg-base-100 px-6 pb-12 pt-20 overflow-hidden">
      {/* Header Section */}
      <Animate variant="fade-down" className="overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-3 group">
              <FileCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Reviews Page
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
              Reviews <span className="text-primary">Page</span>
            </h1>
            <p className="text-secondary font-medium max-w-md opacity-60">
              Manage document approvals, rejections, and pending actions.
            </p>
          </div>
        </div>
      </Animate>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-12 items-stretch">
        {statsData.map((stat) => (
          <Animate key={stat.label} className="h-full">
            <GlassCard
              bg={stat.glass}
              border={`border-${stat.color}/20`}
              className="h-full hover:translate-y-[-6px] transition-all duration-500 group shadow-xl"
            >
              <div className="py-6 lg:py-12 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                <div
                  className={`p-3 lg:p-5 rounded-2xl lg:rounded-[2rem] bg-base-100/50 text-${stat.color} mb-3 lg:mb-6 shadow-xl border border-base-300/50 group-hover:scale-110 transition-transform duration-500`}
                >
                  <stat.icon
                    size={22}
                    className="lg:w-8 lg:h-8"
                    strokeWidth={2}
                  />
                </div>

                <span className="text-3xl lg:text-5xl font-black tracking-tighter text-base-content">
                  {stat.val}
                </span>

                <span className="text-[9px] lg:text-[10px] font-black uppercase opacity-40 tracking-[0.2em] lg:tracking-[0.4em] mt-1 lg:mt-2">
                  {stat.label}
                </span>
              </div>
            </GlassCard>
          </Animate>
        ))}
      </div>

      {/* Toolbar */}
      <Animate>
        <div className="max-w-7xl mx-auto px-6 py-4 bg-base-200/40 border border-base-300/30 rounded-[1.5rem] p-6 lg:p-10 backdrop-blur-xl shadow-xl flex flex-col gap-10 mb-10">
          {/* Filter Section */}
          {/* flex-col items-center: Centered on mobile | lg:items-start: Left-aligned on desktop */}
          <div className="space-y-4 flex flex-col items-center lg:items-start">

            {/* Label: justify-center on mobile | lg:justify-start on desktop */}
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-base-content/50 flex items-center justify-center lg:justify-start gap-2 w-full">
              <FilterX size={14} className="text-primary" /> Status Filters
            </span>

            {/* Responsive Container */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 w-full">

              {/* Buttons Group: Stacked full-width on mobile | Row on lg */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 w-full lg:w-auto">
                {FILTERS.map((f) => {
                  let color = "bg-slate-500";
                  if (f === "approved") color = "bg-success";
                  if (f === "pending") color = "bg-accent";
                  if (f === "rejected") color = "bg-error";

                  return (
                    <button
                      key={f}
                      onClick={() => handleFilterChange(f)}
                      className={`btn btn-md w-full sm:w-auto rounded-2xl font-bold uppercase text-[11px] transition-all px-6 border-0 ${filter === f
                          ? `${color} text-white shadow-lg scale-[1.02] lg:scale-105`
                          : "bg-base-100 text-base-content/60 hover:bg-base-300 shadow-sm"
                        }`}
                    >
                      {f.replace("_", " ")}
                    </button>
                  );
                })}
              </div>

              {/* Search Input: Centered on mobile via parent flex-col */}
              <div className="relative w-full lg:max-w-xs shadow-md border border-base-300/30 rounded-2xl overflow-hidden bg-base-100">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search by title, username..."
                  value={search}
                  onChange={handleSearchChange}
                  className="input w-full pl-12 bg-base-100 focus:outline-none border-none font-bold text-xs h-12 placeholder:text-base-content/30"
                />
              </div>

            </div>
          </div>
        </div>
      </Animate>

      <Animate className="overflow-hidden" variant="fade-up">
        {/* Legend Header */}
        <div className="max-w-7xl mx-auto px-6 py-4 rounded-t-[1.25rem] border border-white/5 border-b-0 bg-base-200/20 backdrop-blur-3xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-[2px] bg-primary/40 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-base-content/30">
                Queue Metadata
              </span>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 md:flex items-center justify-center justify-items-center gap-x-8 gap-y-4 md:gap-x-12 text-center">
              {[
                { label: "Approved", status: "approved", desc: "Verified" },
                { label: "Pending", status: "pending", desc: "Awaiting" },
                { label: "Rejected", status: "rejected", desc: "Declined" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                  <FileStatus status={item.status} />
                  <div className="flex flex-col leading-none">
                    <span className="text-[11px] font-black text-base-content/80 tracking-tight">
                      {item.label}
                    </span>
                    <span className="text-[7px] font-bold text-base-content/20 uppercase tracking-widest mt-1">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-b-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="relative rounded-b-[1rem] border border-base-300/30 bg-base-200/20 backdrop-blur-2xl shadow-xl overflow-hidden h-[70vh]">

              {/* Table Overlay Loader - Shows only when isTableUpdating is true */}
              {isTableUpdating && <LoadingTableData />}

              <div className="w-full overflow-x-auto overflow-y-auto h-[70vh] scrollbar-custom">
                {paginatedReviews.length > 0 ? (
                  <table className="table w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                      <tr className="bg-base-300/90 backdrop-blur-md text-secondary uppercase text-[11px] font-black">
                        <th className="py-6 px-10">Document Title</th>
                        <th className="text-center">Status</th>
                        <th>Summary</th>
                        <th>Author</th>
                        <th className="text-right px-10">Date</th>
                        <th className="text-right px-10">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300/5">
                      {paginatedReviews.map((review) => (
                        <tr
                          key={review.id}
                          className="hover:bg-primary/5 transition-colors group"
                        >
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-base-300/30 rounded-xl group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                                {getReviewIcon(review.review_status.toLowerCase())}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-base-content leading-tight group-hover:text-primary transition-colors text-base">
                                  {review.new_version?.document_title || "Unknown Document"}
                                </span>
                                <span className="text-[10px] opacity-40 font-mono italic truncate max-w-[300px]">
                                  ID: {review.new_version?.document_id || "N/A"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="flex justify-center scale-90">
                              <FileStatus status={review.review_status.toLowerCase()} />
                            </div>
                          </td>
                          <td>
                            <div className="bg-base-300/10 p-3 rounded-xl border border-base-300/20 text-[11px] font-medium opacity-80 max-w-md">
                              {review.new_version?.content || review.comments || "No summary provided."}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar group">
                                <div className="w-7 h-7 rounded-full ring ring-primary/10 ring-offset-base-100 ring-offset-1 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300 overflow-hidden bg-base-300">
                                  <img
                                    src={review.new_version?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.new_version?.creator_name || "User")}`}
                                    alt={review.new_version?.creator_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <span className="text-[11px] font-bold opacity-70">
                                {review.new_version?.creator_name || "Unknown Author"}
                              </span>
                            </div>
                          </td>
                          <td className="text-right px-10 text-[11px] opacity-60">
                            <div className="flex flex-col items-end">
                              {(() => {
                                const rawDate = review.reviewed_at || review.new_version?.created_at;

                                if (!rawDate) return <span className="opacity-30">N/A</span>;

                                const d = new Date(rawDate);
                                const dateStr = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                                const yearStr = d.getFullYear();
                                const timeStr = d.toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true
                                });

                                return (
                                  <>
                                    {/* Date Div */}
                                    <div className="font-bold text-base-content/80 leading-tight">
                                      {dateStr}, {yearStr}
                                    </div>

                                    {/* Time Div */}
                                    <div className="text-[9px] opacity-50 font-mono uppercase leading-tight tracking-tighter">
                                      {timeStr}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="text-right px-10">
                            <Link
                              to={`/version-review/${review.id}`}
                              className="btn btn-sm btn-primary rounded-xl px-6 gap-2 shadow-lg hover:scale-105 transition-all"
                            >
                              View Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  !isTableUpdating && (
                    <div className="flex flex-col items-center justify-center py-40 opacity-20 gap-4">
                      <XCircle size={80} strokeWidth={1} />
                      <div className="text-center">
                        <p className="text-xl font-black uppercase tracking-[0.3em]">
                          Queue Empty
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-2">
                          No reviews match your criteria
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            Matches Found: {filteredReviews.length}
          </div>
          <div className="join border border-base-300/30 bg-base-200/50 rounded-2xl p-1 shadow-lg">
            <button
              className="join-item btn btn-sm btn-ghost hover:bg-base-300/70"
              onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo(0, 0); }}
              disabled={currentPage === 1 || isTableUpdating}
            >
              <ChevronLeft size={16} />
            </button>
            <button className="join-item px-4 no-animation cursor-default">
              <span className="opacity-40 mr-2 uppercase text-[10px] font-black">Page</span>
              <span className="text-primary font-black">{currentPage}</span>
              <span className="mx-2 opacity-20">/</span>
              <span className="opacity-40 font-bold">{totalPages}</span>
            </button>
            <button
              className="join-item btn btn-sm btn-ghost hover:bg-base-300/70"
              onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 0); }}
              disabled={currentPage === totalPages || isTableUpdating}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Animate>
    </div>
  );
};

export default ReviewPage;