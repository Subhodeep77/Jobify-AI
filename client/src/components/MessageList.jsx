import JobCard from "../components/JobCard";
import MessageGroup from "../components/MessageGroup";

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
    } catch {}
  }

  return msg;
};

/**
 * 🔥 GROUPING FUNCTION
 */
const groupMessages = (messages) => {
  const groups = [];

  messages.forEach((rawMsg) => {
    const msg = normalizeMessage(rawMsg);

    // 🔹 Jobs handled separately
    if (msg.type === "jobs") {
      groups.push({ type: "jobs", data: msg.data });
      return;
    }

    const lastGroup = groups[groups.length - 1];

    if (
      lastGroup &&
      lastGroup.role === msg.role &&
      msg.role !== "system"
    ) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({
        role: msg.role,
        messages: [msg],
      });
    }
  });

  return groups;
};

const MessageList = ({ messages }) => {
  const grouped = groupMessages(messages);

  return (
    <div className="flex flex-col gap-6">
      {grouped.map((group, i) => {
        // 🔹 JOBS
        if (group.type === "jobs") {
          return (
            <div key={i} className="grid gap-4">
              {(group.data || []).map((job, idx) => (
                <JobCard key={idx} job={job} />
              ))}
            </div>
          );
        }

        // 🔹 SYSTEM
        if (group.role === "system") {
          return (
            <div
              key={i}
              className="text-xs text-gray-500 text-center"
            >
              {group.messages[0]?.content}
            </div>
          );
        }

        return (
          <MessageGroup
            key={i}
            role={group.role}
            messages={group.messages}
            formatMarkdown={formatMarkdown}
          />
        );
      })}
    </div>
  );
};

export default MessageList;