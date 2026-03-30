import MessageBubble from "./MessageBubble";

const MessageGroup = ({ messages, role, formatMarkdown }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* 🔹 Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
          AI
        </div>
      )}

      {/* 🔹 Messages Stack */}
      <div className="flex flex-col gap-2 max-w-xl">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            isUser={isUser}
            formatMarkdown={formatMarkdown}
          />
        ))}
      </div>

      {/* 🔹 User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
          {getInitials(messages[0]?.name || "U")}
        </div>
      )}
    </div>
  );
};

// 🔹 Helper
const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default MessageGroup;