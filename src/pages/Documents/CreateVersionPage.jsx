import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GitBranchPlus,
  FileText,
  AlignLeft,
  Upload,
  Save,
  X,
  History,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";
import Loader from "@/components/widgets/Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export default function CreateVersionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    content: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, versionsRes] = await Promise.all([
          api.get(`/documents/${id}/`),
          api.get(`/versions/document/${id}/`)
        ]);

        setDocument(docRes.data);
        setVersions(versionsRes.data);

      } catch (err) {
        setError("Database Linkage Failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [errors, setErrors] = useState({});

  console.log(document, versions);

  const activeVersion = useMemo(() =>
    document?.active_version || (versions.length ? versions[0] : null),
    [document, versions]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    setErrors((prev) => ({
      ...prev,
      file: "",
      form: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setErrors({ file: "File is required." });
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("file", file);
      formDataToSend.append("document", id);
      formDataToSend.append("content", formData.content || "");

      await api.post(
        `/versions/document/${id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate(`/documents/${id}`);

    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        setErrors(err.response.data);
      } else {
        setErrors({ form: "Upload failed." });
      }
    }
  }

  if (loading) {
    return (
      <Loader message="Loading document and versions..." />
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-error">
        {error.message || "An error occurred while loading the document."}
      </div>
    );
  }

  if (!document) {
    return (
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body items-center text-center">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="text-base-content/70">
                Cannot create a version because this document does not exist in
                the current mock data.
              </p>
              <Link to="/documents" className="btn btn-primary mt-2">
                Back to Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/documents/${id}`}
            className="btn btn-sm btn-ghost border border-base-300 hover:white hover:text-white transition w-fit"
          >
            <ArrowLeft size={16} />
            Back to Details
          </Link>
        </div>


        {/* Create Version */}
        <Animate variant="fade-down">
          <div className="hero rounded-3xl border border-base-300 bg-base-200">
            <div className="hero-content w-full flex-col items-start justify-between gap-6 py-8 lg:flex-row lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <GitBranchPlus size={16} />
                  <span>Version Management</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Create Version
                </h1>

                <p className="max-w-3xl text-base-content/70">
                  Create a new version for{" "}
                  <span className="font-medium">{document.title}</span> based on
                  the current active version.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white bg-primary shadow-md shadow-primary/30 border border-primary">
                    <FileText size={14} />
                    Active{" "}
                    {activeVersion ? `v${activeVersion.version_number}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Animate>

        <Animate>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="card border border-base-300 bg-base-200 shadow-sm">
              <div className="card-body gap-5">
                <div>
                  <h2 className="card-title text-xl">Version Information</h2>
                  <p className="text-sm text-base-content/70">
                    Define the new version label and add a short summary of the
                    changes.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text flex items-center gap-2 font-medium">
                        <History size={16} />
                        Based On
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={
                        activeVersion ? `v${activeVersion.version_number}` : ""
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card border border-base-300 bg-base-200 shadow-sm">
              <div className="card-body gap-5">
                <div>
                  <h2 className="card-title text-xl">Version Content</h2>
                  <p className="text-sm text-base-content/70">
                    Update the content for the new version or attach a revised
                    file.
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Content</span>
                  </label>
                  <textarea
                    name="content"
                    className="textarea textarea-bordered min-h-40 w-full"
                    value={formData.content}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2 font-medium">
                      <Upload size={16} />
                      Attachment
                    </span>
                  </label>

                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                  />

                  {file && (
                    <p className="mt-2 text-sm text-base-content/70">
                      Selected file:{" "}
                      <span className="font-medium">{file.name}</span>
                    </p>
                  )}
                </div>

                {errors.form && (
                  <div className="alert alert-error">
                    <span>{errors.form}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to={`/documents/${id}`}
                className="btn btn-ghost gap-2"
              >
                <X size={16} />
                Cancel
              </Link>

              <button type="submit" className="btn btn-primary gap-2">
                <Save size={16} />
                Create Version
              </button>
            </div>
          </form>
        </Animate>
      </div>
    </section>
  );
}
