import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowLeft,
  Loader2,
  Plus,
  Minus,
  ExternalLink,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import FileStatus from "@/components/widgets/FileStatus.jsx";
import notify from "@/components/toaster/notify";
import api from "@/components/api/api";

/* ------------------------------------------------------------------ */
/*  Diff viewer                                                        */
/* ------------------------------------------------------------------ */
function DiffViewer({ diffData, rawContent }) {
  const { lines, additions, deletions } = useMemo(() => {
    if (!diffData) return { lines: [], additions: 0, deletions: 0 };

    let diffLines = diffData.diff || [];

    // First version with no parent — show all lines as insertions
    if (
      diffData.has_parent === false &&
      diffLines.length === 0 &&
      diffData.new_content
    ) {
      diffLines = diffData.new_content.split("\n").map((v) => ({
        type: "insert",
        value: v,
      }));
    }

    let oNum = 0,
      nNum = 0,
      adds = 0,
      dels = 0;

    const numbered = diffLines.map((entry) => {
      let o = "",
        n = "";
      if (entry.type === "equal") {
        oNum++;
        nNum++;
        o = oNum;
        n = nNum;
      } else if (entry.type === "delete") {
        oNum++;
        dels++;
        o = oNum;
      } else if (entry.type === "insert") {
        nNum++;
        adds++;
        n = nNum;
      }
      return { ...entry, o, n };
    });

    return { lines: numbered, additions: adds, deletions: dels };
  }, [diffData]);

  if (!diffData && !rawContent) return null;

  /* Binary fallback */
  if (diffData?.can_compare === false) {
    return (
      <div className="flex flex-col items-center gap-4 min-h-[460px] justify-center text-base-content/40">
        <FileText size={48} />
        <p className="text-sm max-w-md text-center">{diffData.message}</p>
        {diffData.file_url && (
          <a
            href={diffData.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline gap-2"
          >
            <ExternalLink size={14} />
            View File
          </a>
        )}
      </div>
    );
  }

  /* Raw content — diff endpoint hasn't loaded yet or no parent */
  if (!diffData && rawContent) {
    return (
      <div className="font-mono text-[13px] leading-6 overflow-auto max-h-[520px] rounded-lg border border-base-300/30">
        {rawContent.split("\n").map((line, i) => (
          <div key={i} className="flex hover:bg-base-content/[0.03]">
            <span className="w-14 shrink-0 text-right pr-3 text-base-content/20 select-none border-r border-base-300/20">
              {i + 1}
            </span>
            <span className="whitespace-pre px-3 text-base-content/75">
              {line}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* Diff view */
  return (
    <div className="space-y-3">
      {lines.length > 0 && (
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1 text-green-400">
            <Plus size={12} />
            {additions} addition{additions !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <Minus size={12} />
            {deletions} deletion{deletions !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="font-mono text-[13px] leading-6 overflow-auto max-h-[520px] rounded-lg border border-base-300/30">
        {lines.map((entry, i) => {
          const isDel = entry.type === "delete";
          const isIns = entry.type === "insert";
          const bg = isDel
            ? "bg-red-500/10"
            : isIns
              ? "bg-green-500/10"
              : "";
          const prefix = isDel ? "-" : isIns ? "+" : " ";
          const prefixClr = isDel
            ? "text-red-500"
            : isIns
              ? "text-green-500"
              : "text-transparent";

          return (
            <div
              key={i}
              className={`flex ${bg} hover:brightness-125 transition-colors`}
            >
              <span className="w-14 shrink-0 text-right pr-3 text-base-content/20 select-none border-r border-base-300/20">
                {entry.o}
              </span>
              <span className="w-14 shrink-0 text-right pr-3 text-base-content/20 select-none border-r border-base-300/20">
                {entry.n}
              </span>
              <span
                className={`w-5 shrink-0 text-center select-none ${prefixClr}`}
              >
                {prefix}
              </span>
              <span className="whitespace-pre px-1 pr-2 text-base-content/80">
                {entry.value}
              </span>
            </div>
          );
        })}

        {lines.length === 0 && (
          <div className="flex items-center justify-center h-32 text-base-content/30 text-sm">
            No differences found
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const now = new Date();
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (d.toDateString() === now.toDateString()) return `Today · ${time}`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return "An unexpected error occurred";
  if (data.error) return data.error;
  const field = Object.keys(data)[0];
  if (field) {
    const msgs = Array.isArray(data[field])
      ? data[field].join(", ")
      : data[field];
    return `${field}: ${msgs}`;
  }
  return "An unexpected error occurred";
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
const VersionReviewPage = () => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [diffData, setDiffData] = useState(null);
  const [diffLoading, setDiffLoading] = useState(false);

  const status = review?.review_status?.toLowerCase() || "pending";
  const isFinalized = status === "approved" || status === "rejected";
  const newVersion = review?.new_version;
  const oldVersion = review?.old_version;

  /* ---- Fetch review ---- */
  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/reviews/${id}/`);
        setReview(res.data);
      } catch (err) {
        const msg = extractErrorMessage(err);
        setError(msg);
        notify.error(msg);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReview();
  }, [id]);

  /* ---- Fetch parent diff ---- */
  useEffect(() => {
    if (!newVersion?.id) return;

    let cancelled = false;

    const fetchDiff = async () => {
      try {
        setDiffLoading(true);
        const res = await api.get(`/versions/${newVersion.id}/diff/`);
        if (!cancelled) setDiffData(res.data);
      } catch (err) {
        console.error("Diff error", err);
        if (!cancelled) {
          setDiffData({
            can_compare: false,
            message: extractErrorMessage(err),
          });
        }
      } finally {
        if (!cancelled) setDiffLoading(false);
      }
    };

    fetchDiff();
    return () => {
      cancelled = true;
    };
  }, [newVersion?.id]);

  /* ---- Actions ---- */
  const handleApprove = async () => {
    try {
      setSubmitting(true);
      const payload = { review_status: "approved" };
      if (comment.trim()) payload.comments = comment.trim();
      const res = await api.patch(`/reviews/${id}/`, payload);
      setReview(res.data);
      setComment("");
      notify.success("Version approved successfully");
    } catch (err) {
      notify.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      notify.error("Please provide a reason for rejecting this version");
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.patch(`/reviews/${id}/`, {
        review_status: "rejected",
        comments: comment.trim(),
      });
      setReview(res.data);
      setComment("");
      notify.error("Version rejected");
    } catch (err) {
      notify.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- Diff label ---- */
  const diffLabel = useMemo(() => {
    if (!diffData || diffData.can_compare === false) return null;
    if (diffData.has_parent === false) return "v1 — initial version";
    return `v${diffData.old_v} → v${diffData.new_v}`;
  }, [diffData]);

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  if (loading) {
    return (
      <div className="px-6 pt-10 pb-16">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-base-content/40">
            <Loader2 className="animate-spin" size={36} />
            <span className="text-sm">Loading review…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 pt-10 pb-16">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <Link
            to="/reviews"
            className="btn btn-sm btn-ghost border border-base-300 hover:text-white transition w-fit"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </Link>
          <div className="card bg-error/10 border border-error/30 p-8 text-center">
            <p className="text-error font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-10 pb-16">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* Back */}
        <Animate>
          <Link
            to="/reviews"
            className="btn btn-sm btn-ghost border border-base-300 hover:text-white transition w-fit"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </Link>
        </Animate>

        {/* Header */}
        <Animate variant="fade-down">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold tracking-tight">
                {newVersion?.title ||
                  newVersion?.name ||
                  `Version ${newVersion?.version_number || ""}`}
              </h1>
              <FileStatus status={status} />
            </div>

            <div className="flex gap-6 text-sm text-base-content/60">
              {newVersion?.created_by && (
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {newVersion.created_by.username ||
                    newVersion.created_by.name ||
                    "Unknown"}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(newVersion?.created_at)}
              </span>
              {newVersion?.version_number && (
                <span className="flex items-center gap-1 text-base-content/40">
                  <FileText size={14} />
                  v{newVersion.version_number}
                </span>
              )}
            </div>
          </div>
        </Animate>

        {/* Grid */}
        <div className="grid xl:grid-cols-[2fr_1fr] gap-10 max-w-[1200px] mx-auto">
          {/* -------- LEFT: Diff viewer -------- */}
          <Animate className="xl:col-span-2">
            <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <FileText size={20} />
                  Version Preview
                </div>

                {diffLabel && (
                  <span className="text-xs font-mono text-base-content/50 bg-base-100/60 px-3 py-1 rounded-md border border-base-300/30">
                    {diffLabel}
                  </span>
                )}
              </div>

              {diffLoading && (
                <div className="flex items-center justify-center min-h-[460px] text-base-content/30 gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">Loading diff…</span>
                </div>
              )}

              {!diffLoading && (
                <DiffViewer
                  diffData={diffData}
                  rawContent={newVersion?.content}
                />
              )}
            </div>
          </Animate>

          {/* -------- RIGHT: Side panel -------- */}
          <Animate variant="fade-left">
            <div className="flex flex-col gap-8">
              {/* Summary */}
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-7 space-y-3">
                <div className="font-semibold text-base">Summary</div>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {newVersion?.summary ||
                    newVersion?.description ||
                    "No summary provided for this version."}
                </p>
              </div>

              {/* Comments */}
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-7 space-y-5">
                <div className="flex items-center gap-2 font-semibold text-base">
                  <MessageSquare size={18} />
                  Comments
                </div>

                {review?.comments ? (
                  <div className="text-sm text-base-content/70 bg-base-100/50 rounded-lg p-4 border border-base-300/30">
                    {review.comments}
                  </div>
                ) : !isFinalized ? (
                  <div className="text-sm text-base-content/50">
                    No comments yet.
                  </div>
                ) : null}

                {!isFinalized && (
                  <>
                    <textarea
                      className="textarea textarea-bordered w-full min-h-[100px]"
                      placeholder={
                        "Leave feedback before approving…\n\n(Required for rejection)"
                      }
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    {!comment.trim() && (
                      <p className="text-xs text-base-content/40">
                        Adding a comment is required when rejecting.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Decision */}
              <div className="card bg-base-200/70 border border-base-300/40 backdrop-blur p-7 flex flex-col gap-3">
                {!isFinalized ? (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-error flex-1 shadow-md shadow-error/30"
                      onClick={handleReject}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <XCircle size={18} />
                      )}
                      Reject
                    </button>
                    <button
                      className="btn btn-success flex-1 shadow-md shadow-success/30"
                      onClick={handleApprove}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                      Approve
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-center">
                      Current status:
                      <span
                        className={`ml-2 font-semibold capitalize px-2 py-1 rounded-md ${
                          status === "approved"
                            ? "text-success bg-success/10 shadow-md shadow-success/30"
                            : "text-error bg-error/10 shadow-md shadow-error/30"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {review?.reviewed_at && (
                      <p className="text-xs text-center text-base-content/40">
                        Reviewed {formatDate(review.reviewed_at)}
                      </p>
                    )}

                    <p className="text-xs text-center text-base-content/40 pt-1">
                      This decision is final. Contact an admin to make changes.
                    </p>

                    <Link
                      to="/reviews"
                      className="btn btn-ghost w-full mt-1"
                    >
                      <ArrowLeft size={16} />
                      Back to Reviews
                    </Link>
                  </>
                )}
              </div>
            </div>
          </Animate>
        </div>
      </div>
    </div>
  );
};

export default VersionReviewPage;