import { useRef, useEffect } from "react";
import { useChatStream } from "../hooks/useChatStream";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";

import { useAuth } from "../context/auth";
import ThemeToggle from "../components/ThemeToggle";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const {
    messages,
    sendMessage,
    loading,
    stopStreaming,
    retryLast,
    error,
  } = useChatStream();

  const { user } = useAuth();
  const bottomRef = useRef(null);

  // 🔹 Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* 🔹 Header (Sticky) */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 backdrop-blur">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Assistant
        </h1>

        <div className="flex items-center gap-4">

          <ThemeToggle />

          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-gray-200">
              {getInitials(user?.name)}
            </div>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user?.name}
            </span>
          </Link>

        </div>
      </div>

      {/* 🔹 Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {!hasMessages ? (
          // 🔥 Empty State
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Start a conversation
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Ask about jobs or your resume
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <MessageList messages={messages} />
            <div ref={bottomRef} />
          </div>
        )}

      </div>

      {/* 🔹 Error + Retry */}
      {error && (
        <div className="px-4 py-2 text-sm text-red-500 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <span>{error}</span>
          <button
            onClick={retryLast}
            className="text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* 🔹 Controls */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-white dark:bg-gray-900">

        {/* Stop button */}
        {loading && (
          <div className="flex justify-end">
            <button
              onClick={stopStreaming}
              className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Stop
            </button>
          </div>
        )}

        <ChatInput onSend={sendMessage} loading={loading} />

      </div>

    </div>
  );
};

// 🔹 Helper
const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default ChatPage;