import { useState } from "react";

const ChatInput = ({ onSend, loading }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const value = input.trim();
    if (!value || loading) return;

    onSend(value);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about jobs or your resume..."
        disabled={loading}
        className="flex-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60"
      />

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