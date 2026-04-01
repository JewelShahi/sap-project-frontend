import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Type,
  Save,
  X,
  Loader2,
  ShieldPlus,
  Info
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";

export default function CreateDocumentPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    title: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  }

  function validateForm() {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Title is required.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (!file) {
      validationErrors.file = "File is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/documents/", {
        title: formData.title.trim(),
      });

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("document", response.data.id);

      await api.post(
        "/versions/document/" + response.data.id + "/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/documents/" + response.data.id);

    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        setErrors(err.response.data);
      } else {
        setErrors({ form: "Upload failed." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="px-6 py-20 min-h-screen bg-base-100 overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* TOP LEVEL NAVIGATION */}
        <Animate variant="fade-down">
          <div className="flex items-center justify-between w-full border-b border-base-300/10 pb-8">
            <Link
              to="/documents"
              className="btn btn-ghost btn-sm gap-2 rounded-xl border border-base-300/50 hover:bg-base-300/50 transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cancel Process</span>
            </Link>
          </div>
        </Animate>

        {/* HERO SECTION */}
        <Animate className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em] opacity-60">
            <ShieldPlus size={12} /> Protocol Initiation
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-base-content leading-[0.9]">
            New Document
          </h1>
          <p className="text-base-content/50 text-md font-medium max-w-md mt-3">
            Initialize a new entry in the secure archive. Versions and assets can be attached post-creation.
          </p>
        </Animate>

        {/* GLASS FORM CARD */}
        <Animate delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-base-200/20 border border-base-300/40 backdrop-blur-md relative group shadow-2xl shadow-base-900/10">

              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-2">
                <Info size={14} /> Identity Configuration
              </h3>

              <div className="space-y-6">
                <div className="form-control w-full">
                  <label className="label mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                      <Type size={14} className="text-primary" /> Document Title
                    </span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="E.g. Internal Audit 2026"
                    className={`bg-base-300/20 border-2 rounded-2xl p-4 text-lg font-bold transition-all outline-none focus:ring-4 focus:ring-primary/10 ${errors.title
                      ? "border-error/50 focus:border-error"
                      : "border-base-300/30 focus:border-primary/50"
                      }`}
                    value={formData.title}
                    onChange={handleChange}
                  />

                  {errors.title && (
                    <div className="mt-3 flex items-center gap-2 text-error animate-pulse">
                      <div className="w-1 h-1 bg-error rounded-full"></div>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{errors.title}</span>
                    </div>
                  )}


                  <label className="label mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                      <Type size={14} className="text-primary" /> File
                    </span>
                  </label>
                  <div
                    className="border-2 border-dashed border-base-300/40 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-all"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFile = e.dataTransfer.files[0];
                      if (droppedFile) setFile(droppedFile);
                    }}
                  >
                    <input
                      type="file"
                      className="hidden"
                      id="fileUpload"
                      accept="image/jpeg,image/png,text/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setFile(e.target.files[0])}
                    />

                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <p className="text-sm opacity-60">
                        Drag & drop a file here or click to upload
                      </p>
                      {file && (
                        <p className="mt-2 text-primary font-bold text-xs">
                          Selected: {file.name}
                        </p>
                      )}
                    </label>
                  </div>


                </div>

                {errors.form && (
                  <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-[10px] font-black uppercase tracking-widest text-center">
                    {errors.form}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-6 pt-4">
              <Link
                to="/documents"
                className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-error transition-all"
              >
                Abort
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary h-14 px-10 rounded-2xl border-none shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                <span className="font-black text-[11px] uppercase tracking-[0.2em]">
                  {isSubmitting ? "Processing..." : "Create Entry"}
                </span>
              </button>
            </div>
          </form>
        </Animate>

      </div>
    </section>
  );
}