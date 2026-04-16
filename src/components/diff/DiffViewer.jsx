import { useMemo } from "react";
import { ExternalLink, FileText, Minus, Plus, AlertCircle } from "lucide-react";
import useTheme from "@/hooks/useTheme";

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

const getExt = (filename = "") =>
  filename.includes(".") ? filename.split(".").pop().toUpperCase() : "N/A";

const getSize = (size) => {
  if (typeof size === "number") return size;
  return 0;
};

const DiffViewer = ({ diffData, rawContent }) => {
  const { theme } = useTheme();

  const { lines, additions, deletions } = useMemo(() => {
    if (!diffData) return { lines: [], additions: 0, deletions: 0 };

    let diffLines = diffData.diff || [];

    if (
      diffData.has_parent === false &&
      diffLines.length === 0 &&
      diffData.new_content
    ) {
      diffLines = diffData.new_content
        .split("\n")
        .map((v) => ({ type: "insert", value: v }));
    }

    let oNum = 0;
    let nNum = 0;
    let adds = 0;
    let dels = 0;

    const numbered = diffLines.map((entry) => {
      let o = "";
      let n = "";

      if (entry.type === "equal") {
        o = ++oNum;
        n = ++nNum;
      } else if (entry.type === "delete") {
        o = ++oNum;
        dels++;
      } else if (entry.type === "insert") {
        n = ++nNum;
        adds++;
      }

      return { ...entry, o, n };
    });

    return { lines: numbered, additions: adds, deletions: dels };
  }, [diffData]);

  if (!diffData && !rawContent) return null;

  const isTxtFile = (filename) =>
    filename?.toLowerCase().endsWith(".txt");

  const oldIsTxt = diffData?.old_filename
    ? isTxtFile(diffData.old_filename)
    : true;

  const newIsTxt = diffData?.new_filename
    ? isTxtFile(diffData.new_filename)
    : true;

  const showUnsupportedFormat = diffData && (!oldIsTxt || !newIsTxt);
  const showCannotCompare = diffData?.can_compare === false;

  const oldName = diffData?.old_filename || "Original";
  const newName = diffData?.new_filename || "Current";

  const oldSize = getSize(diffData?.old_size);
  const newSize = getSize(diffData?.new_size);

  const oldExt = getExt(oldName);
  const newExt = getExt(newName);

  const FileHeader = () => (
    <div className="flex flex-wrap items-center gap-3 mb-3 p-2 bg-base-950/20 rounded-lg border border-base-300/10 text-[10px] font-bold uppercase tracking-tight">
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-error/20 text-error border border-error/20">
          OLD / SELECTED
        </span>

        <span className="text-base-content/40 truncate max-w-[220px]">
          {oldName} ({oldExt} • {formatBytes(oldSize)})
        </span>
      </div>

      <div className="text-base-content/20">vs</div>

      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 rounded bg-success/20 text-success border border-success/20">
          NEW / CURRENT
        </span>

        <span className="text-base-content/40 truncate max-w-[220px]">
          {newName} ({newExt} • {formatBytes(newSize)})
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <FileHeader />

      {showUnsupportedFormat ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/40 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl bg-base-200/5">
          <AlertCircle size={36} className="text-warning opacity-60" />
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-tight">
              Format Not Supported
            </p>
            <p className="text-[11px] mt-1 opacity-70">
              Diffs can only be shown for .txt files.
            </p>
          </div>
        </div>
      ) : showCannotCompare ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/30 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
          <FileText size={36} className="opacity-40" />
          <p className="text-xs max-w-xs text-center font-semibold leading-relaxed">
            {diffData.message}
          </p>

          {diffData.file_url && (
            <a
              href={diffData.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-primary gap-2 hover:bg-primary/60 text-white rounded-xl text-[10px] uppercase tracking-widest font-black"
            >
              <ExternalLink size={12} /> View File
            </a>
          )}
        </div>
      ) : (
        <>
          {lines.length > 0 && (
            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest shrink-0 pb-2.5 mb-2.5 border-b border-base-300/20">
              <span className="flex items-center gap-1.5 text-success">
                <Plus size={11} />
                {additions} Addition{additions !== 1 ? "s" : ""}
              </span>

              <span className="flex items-center gap-1.5 text-error">
                <Minus size={11} />
                {deletions} Deletion{deletions !== 1 ? "s" : ""}
              </span>

              <span className="ml-auto text-base-content/20">
                {lines.length} line{lines.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="overflow-y-auto overflow-x-hidden flex-1 rounded-xl border border-base-300/20 bg-base-950/40 shadow-inner custom-scrollbar">
            <div className="font-mono text-[12px] leading-6 w-full">
              {lines.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-base-content/20 text-[10px] font-black uppercase tracking-widest">
                  No Differences Found
                </div>
              ) : (
                lines.map((entry, i) => {
                  const isDel = entry.type === "delete";
                  const isIns = entry.type === "insert";

                  const rowBg = isDel
                    ? "bg-error/15 hover:bg-error/20"
                    : isIns
                    ? "bg-success/15 hover:bg-success/20"
                    : "hover:bg-base-content/5";

                  const prefix = isDel ? "−" : isIns ? "+" : " ";

                  return (
                    <div
                      key={i}
                      className={`flex items-start transition-colors border-b border-base-content/5 last:border-0 ${rowBg}`}
                    >
                      <span className="w-5 shrink-0 text-center py-0.5 select-none font-black self-start pt-[3px]">
                        {prefix}
                      </span>

                      <span className="whitespace-pre-wrap break-all py-0.5 pl-2 pr-4 text-base-content/80 min-w-0 flex-1">
                        {entry.value || "\u00A0"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiffViewer;