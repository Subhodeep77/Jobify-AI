import { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import api from "../services/api";

const ChatInput = ({ onSend, loading, addLocalMessage }) => {
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef(null);

  const handleSend = () => {
    const value = input.trim();
    if (!value || loading) return;

    onSend(value);
    setInput("");
  };

  // 🔹 Open file picker
  const handleFileClick = () => {
    fileRef.current?.click();
  };

  // 🔹 Upload resume
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addLocalMessage({
        role: "system",
        content: "📄 Resume uploaded successfully. You can now ask for job recommendations.",
      });

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 🔹 Upload Button */}
      <button
        onClick={handleFileClick}
        disabled={uploading}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {uploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Plus size={18} />
        )}
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 🔹 Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about jobs or your resume..."
        disabled={loading}
        className="flex-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60"
      />

      {/* 🔹 Send */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg disabled:opacity-60"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
