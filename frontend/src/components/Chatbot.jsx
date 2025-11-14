import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { apiRoutes } from "../services/apiServices.js";
import "./Chatbot.css";

const ChatbotModal = ({ close }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  function convertMarkdownToText(markdownText) {
    if (!markdownText) return "";
    let plain = markdownText;
    plain = plain.replace(/```[\s\S]*?```/g, "");
    plain = plain.replace(/`([^`]+)`/g, "$1");
    plain = plain.replace(/(\*\*|__)(.*?)\1/g, "$2");
    return plain.trim();
  }

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: prompt }]);
    setLoading(true);

    try {
      const res = await axios.post(apiRoutes.chatbotURI, { query: prompt });
      const clean = convertMarkdownToText(res.data.responseText);

      setMessages((prev) => [...prev, { type: "bot", text: clean || "No response." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: "⚠️ Error connecting to server." }]);
    }

    setPrompt("");
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendPrompt();
  };

  return (
    <div className="chatbot-modal-overlay" onClick={close}>
      <div className="chatbot-modal big" onClick={(e) => e.stopPropagation()}>

        <div className="chatbot-modal-header">
          <h3 className="chat-title">🏠 House Suggesting Chatbot</h3>
          <button className="close-btn" onClick={close}>✖</button>
        </div>

        <div className="chatbot-modal-body">
          <div className="chatbot-message-list">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-row ${msg.type === "user" ? "user" : "bot"}`}
              >
                <div className={`chat-bubble ${msg.type}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        <div className="chatbot-modal-footer">
          <input
            className="chat-input"
            placeholder="Ask something..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="send-btn" onClick={sendPrompt} disabled={loading}>
            {loading ? <div className="loader"></div> : "➤"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatbotModal;
