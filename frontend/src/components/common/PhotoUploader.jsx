import { useState } from "react";

// Generic "pick one or more photos" widget, reused for avatar uploads
// (single file) and listing photo uploads (multiple files). It only
// collects File objects and hands them to whatever onUpload callback the
// parent page provides — it doesn't know or care which API endpoint
// eventually receives them.
export function PhotoUploader({ multiple = false, onUpload, label = "Upload photo" }) {
  const [status, setStatus] = useState("idle"); // idle | uploading | error | done

  async function handleChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setStatus("uploading");
    try {
      await onUpload(multiple ? files : files[0]);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <input type="file" accept="image/*" multiple={multiple} onChange={handleChange} />
      {status === "uploading" && <p className="muted uploader-note">Uploading…</p>}
      {status === "error" && <p className="uploader-error uploader-note">Upload failed. Try again.</p>}
      {status === "done" && <p className="muted uploader-note">Uploaded.</p>}
    </div>
  );
}
