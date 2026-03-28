import { useRef, useState, useEffect } from "react";

export const useChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);
  const lastInputRef = useRef("");

  // 🔹 Load history (NO normalization needed now)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/chat/history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();

        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };

    fetchHistory();
  }, []);

  const sendMessage = async (input) => {
    if (!input.trim() || loading) return;

    lastInputRef.current = input;
    setError(null);

    // 🔹 Add user + thinking placeholder
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        type: "chat",
        content: input,
        data: null,
      },
      {
        role: "assistant",
        type: "chat",
        content: "Thinking...",
        data: null,
        streaming: true,
        isThinking: true,
      },
    ]);

    setLoading(true);

    try {
      controllerRef.current = new AbortController();

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: input }),
          signal: controllerRef.current.signal,
        }
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let firstTokenReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        buffer = chunks.pop();

        for (const chunk of chunks) {
          if (!chunk.startsWith("data:")) continue;

          const parsed = JSON.parse(chunk.replace("data: ", ""));
          const { event, data } = parsed;

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];

            // 🔹 STREAM TEXT
            if (event === "message") {
              if (!firstTokenReceived) {
                last.content = "";
                last.isThinking = false;
                firstTokenReceived = true;
              }
              last.content += data;
            }

            // 🔹 AGENT STEP
            if (event === "agent_step") {
              updated.push({
                role: "system",
                type: "chat",
                content:
                  typeof data === "string"
                    ? data
                    : JSON.stringify(data),
                data: null,
              });
            }

            // 🔹 DONE (CLEAN TYPE HANDLING)
            if (event === "done") {
              last.streaming = false;

              if (data?.type === "chat") {
                last.content = data.answer;
              }

              if (data?.type === "jobs") {
                updated.push({
                  role: "assistant",
                  type: "jobs",
                  content: null,
                  data: data.recommended_roles || [],
                });
              }

              setLoading(false);
            }

            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);

      setError("Something went wrong. Please try again.");

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          type: "chat",
          content: "⚠️ Failed to generate response.",
          data: null,
        },
      ]);

      setLoading(false);
    }
  };

  const stopStreaming = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  const retryLast = () => {
    if (lastInputRef.current) {
      sendMessage(lastInputRef.current);
    }
  };

  const addLocalMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    stopStreaming,
    retryLast,
    addLocalMessage
  };
};