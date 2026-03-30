import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ msg, isUser, formatMarkdown }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!msg.content) {
      console.warn("Nothing to copy");
      return;
    }

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
      className={`relative group max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap ${
        isUser
          ? "ml-auto bg-black text-white dark:bg-white dark:text-black"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      }`}
    >
      {/* 🔥 COPY BUTTON (NOW INSIDE BUBBLE) */}
      {msg.content && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 p-1.5 rounded bg-gray-800/70 text-white opacity-70 hover:opacity-100 transition"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              <SyntaxHighlighter style={vscDarkPlus} language={match[1]}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-300 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                {children}
              </code>
            );
          },

          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {children}
              </a>
            );
          },

          ul({ children }) {
            return <ul className="list-disc ml-5">{children}</ul>;
          },

          ol({ children }) {
            return <ol className="list-decimal ml-5">{children}</ol>;
          },

          p({ children }) {
            return <p className="mb-2">{children}</p>;
          },
        }}
      >
        {isUser ? msg.content : formatMarkdown(msg.content)}
      </ReactMarkdown>

      {msg.streaming && <span className="ml-1 animate-pulse">▌</span>}
    </div>
  );
};

export default MessageBubble;
