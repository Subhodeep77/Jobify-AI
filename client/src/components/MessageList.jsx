import JobCard from "../components/JobCard";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * 🔥 Normalize AI output → proper markdown
 */
const formatMarkdown = (text) => {
  if (!text) return "";

  return text
    // Fix bold sections → add spacing
    .replace(/\*\*(.*?)\*\*/g, "\n\n**$1**\n\n")

    // Convert "* " to proper markdown bullets
    .replace(/\*\s+/g, "\n- ")

    // Ensure line breaks after sentences (optional but useful)
    .replace(/([a-z])\.\s([A-Z])/g, "$1.\n\n$2")

    // Remove excessive newlines
    .replace(/\n{3,}/g, "\n\n")

    .trim();
};

const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, i) => {
        const key = msg.id || `${msg.role}-${i}`;

        // 🔹 JOB RESULT
        if (msg.type === "jobs") {
          return (
            <div key={key} className="grid gap-4">
              {(msg.data || []).map((job, idx) => (
                <JobCard key={`${job.role}-${idx}`} job={job} />
              ))}
            </div>
          );
        }

        // 🔹 SYSTEM MESSAGE
        if (msg.role === "system") {
          return (
            <div
              key={key}
              className="text-xs text-gray-500 dark:text-gray-400 text-center"
            >
              {msg.content}
            </div>
          );
        }

        const isUser = msg.role === "user";

        return (
          <div
            key={key}
            className={`max-w-xl px-4 py-2 rounded-lg whitespace-pre-wrap ${
              isUser
                ? "ml-auto bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            {/* 🔥 Markdown Rendering */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 🔹 Code Block Renderer
                code({ inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-300 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                      {children}
                    </code>
                  );
                },

                // 🔹 Links
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

                // 🔹 Lists
                ul({ children }) {
                  return <ul className="list-disc ml-5 space-y-1">{children}</ul>;
                },

                ol({ children }) {
                  return (
                    <ol className="list-decimal ml-5 space-y-1">{children}</ol>
                  );
                },

                // 🔹 Paragraph spacing
                p({ children }) {
                  return <p className="mb-2 leading-relaxed">{children}</p>;
                },

                // 🔹 Headings
                h1({ children }) {
                  return (
                    <h1 className="text-lg font-semibold mb-2">{children}</h1>
                  );
                },

                h2({ children }) {
                  return (
                    <h2 className="text-base font-semibold mb-2">{children}</h2>
                  );
                },

                h3({ children }) {
                  return (
                    <h3 className="text-sm font-semibold mb-1">{children}</h3>
                  );
                },
              }}
            >
              {isUser ? msg.content : formatMarkdown(msg.content)}
            </ReactMarkdown>

            {/* 🔹 Streaming Cursor */}
            {msg.streaming && (
              <span className="ml-1 animate-pulse">▌</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;