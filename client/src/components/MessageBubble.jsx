import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

const MessageBubble = ({ msg, isUser, formatMarkdown }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!msg.content) return;

    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className={`relative group max-w-xl px-4 py-2 rounded-lg ${
        isUser
          ? "ml-auto bg-black text-white dark:bg-white dark:text-black"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      }`}
    >
      {/* 🔥 COPY BUTTON */}
      {msg.content && (
        <button
          onClick={handleCopy}
          className="
            absolute top-2 right-2 z-10 p-1.5 rounded
            bg-gray-800/70 text-white
            opacity-70 hover:opacity-100 transition
          "
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}

      {/* 🔥 CLEAN MARKDOWN (NO CUSTOM STYLING OVERRIDES) */}
      <div className="reset-tw text-sm leading-relaxed">
        <Markdown remarkPlugins={[remarkGfm]}>
          {isUser ? msg.content : formatMarkdown(msg.content)}
        </Markdown>
      </div>

      {/* 🔹 Streaming Cursor */}
      {msg.streaming && (
        <span className="ml-1 animate-pulse">▌</span>
      )}
    </div>
  );
};

export default MessageBubble;