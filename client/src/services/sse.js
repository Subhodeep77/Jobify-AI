export const createSSEConnection = (url, onMessage, onError) => {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("SSE Parse Error:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE Error:", err);
    eventSource.close();
    if (onError) onError(err);
  };

  return eventSource;
};