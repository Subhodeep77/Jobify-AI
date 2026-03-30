import JobCard from "../components/JobCard";
import MessageBubble from "../components/MessageBubble";

/**
 * 🔥 Normalize AI output
 */
const formatMarkdown = (text) => {
  if (!text) return "";

  return text
    .replace(/\*\*(.*?)\*\*/g, "\n\n**$1**\n\n")
    .replace(/\*\s+/g, "\n- ")
    .replace(/([a-z])\.\s([A-Z])/g, "$1.\n\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/**
 * 🔥 Normalize message
 */
const normalizeMessage = (msg) => {
  if (msg.type === "jobs") return msg;

  if (msg.role === "assistant" && typeof msg.content === "string") {
    try {
      const parsed = JSON.parse(msg.content);
      if (parsed?.recommended_roles) {
        return {
          role: "assistant",
          type: "jobs",
          data: parsed.recommended_roles,
        };
      }
    } catch { /* empty */ }
  }

  return msg;
};

const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((rawMsg, i) => {
        const msg = normalizeMessage(rawMsg);
        const key = msg.id || `${msg.role}-${i}`;

        // 🔹 JOBS
        if (msg.type === "jobs") {
          return (
            <div key={key} className="grid gap-4">
              {(msg.data || []).map((job, idx) => (
                <JobCard key={idx} job={job} />
              ))}
            </div>
          );
        }

        // 🔹 SYSTEM
        if (msg.role === "system") {
          return (
            <div
              key={key}
              className="text-xs text-gray-500 text-center"
            >
              {msg.content}
            </div>
          );
        }

        return (
          <MessageBubble
            key={key}
            msg={msg}
            isUser={msg.role === "user"}
            formatMarkdown={formatMarkdown}
          />
        );
      })}
    </div>
  );
};

export default MessageList;