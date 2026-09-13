import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello! Welcome to VirtualTrade. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const userText = input.trim();
    if (!userText || loading) return;

    const userMessage = { sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/chat", {
        message: userText,
      });

      const botReply = res.data?.reply || "I didn't get a response. Please try again.";
      setMessages((prev) => [...prev, { sender: "assistant", text: botReply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Sorry, I am having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold px-4 py-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>Chat</span>
        </button>
      )}

      {/* Simple Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-800/80 px-4 py-3 border-b border-zinc-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <h3 className="text-sm font-semibold text-zinc-100">VirtualTrade Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-100 p-1 transition-colors cursor-pointer"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-xl whitespace-pre-wrap leading-relaxed text-xs sm:text-sm ${
                      isUser
                        ? "bg-teal-500 text-zinc-950 font-medium rounded-br-none"
                        : "bg-zinc-800 text-zinc-200 border border-zinc-700/50 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-zinc-400 border border-zinc-700/50 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 bg-zinc-950/60 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-zinc-800 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:hover:bg-teal-500 text-zinc-950 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
