import { useRef, useState } from "react";

export const useChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const eventSourceRef = useRef(null);

  const closeConnection = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const sendMessage = (input) => {
    if (!input?.trim()) return;

    // Add user + placeholder assistant message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: "", streaming: true },
    ]);

    setLoading(true);

    const url = `${import.meta.env.VITE_SSE_BASE_URL}/chat?query=${encodeURIComponent(
      input
    )}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          switch (data.type) {
            case "message":
              // stream tokens
              last.content += data.token || "";
              break;

            case "agent_step":
              updated.push({
                role: "system",
                content: data.message,
              });
              break;

            case "jobs":
              updated.push({
                role: "jobs",
                jobs: data.recommended_roles || [],
              });
              break;

            case "done":
              last.streaming = false;
              closeConnection();
              setLoading(false);
              break;

            default:
              break;
          }

          return updated;
        });
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE error:", err);
      closeConnection();
      setLoading(false);
    };
  };

  return { messages, loading, sendMessage };
};