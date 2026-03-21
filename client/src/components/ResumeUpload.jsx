import { useState } from "react";
import { uploadResume } from "../api/api";

export default function ResumeUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const result = await uploadResume(file);
    setLoading(false);

    if (result.success) {
      onUploaded(result.collectionName);
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={e => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}