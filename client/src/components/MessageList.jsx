import JobCard from "../components/JobCard";

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

        // 🔹 CHAT (USER / ASSISTANT)
        const isUser = msg.role === "user";

        return (
          <div
            key={key}
            className={`max-w-xl px-4 py-2 rounded-lg ${
              isUser
                ? "ml-auto bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }`}
          >
            {msg.content}

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