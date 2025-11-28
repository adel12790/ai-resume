"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./ChatInterface.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, streamingMessage]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage("");
    setHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setStreamingMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history, feedback })
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get response");
      }

      // Read the streaming response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullReply += chunk;
        setStreamingMessage(fullReply);
      }

      // Evaluate response after streaming completes
      const evalRes = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: fullReply, message: userMsg, history })
      });
      
      const evalData = await evalRes.json();

      if (evalData.is_acceptable) {
        setHistory(prev => [...prev, { role: "assistant", content: fullReply }]);
        setStreamingMessage("");
        setFeedback(null);
      } else {
        // Retry with feedback
        console.log("Response rejected, retrying with feedback:", evalData.feedback);
        setStreamingMessage("");
        
        const retryRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, history, feedback: evalData.feedback })
        });

        if (!retryRes.ok || !retryRes.body) {
          throw new Error("Failed to get retry response");
        }

        // Stream the retry response
        const retryReader = retryRes.body.getReader();
        let retryReply = "";

        while (true) {
          const { done, value } = await retryReader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          retryReply += chunk;
          setStreamingMessage(retryReply);
        }

        setHistory(prev => [...prev, { role: "assistant", content: retryReply }]);
        setStreamingMessage("");
        setFeedback(null);
      }

    } catch (error) {
      console.error(error);
      setStreamingMessage("");
      setHistory(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <h2 className={styles.chatTitle}>Ask me anything about my experience</h2>
        <p className={styles.chatSubtitle}>Powered by AI • Real-time responses</p>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {history.length === 0 && (
          <div className={styles.welcomeMessage}>
            <h3>👋 Welcome!</h3>
            <p>Ask me about my experience, skills, projects, or anything else you'd like to know.</p>
            <div className={styles.suggestedQuestions}>
              <button 
                className={styles.suggestionBtn}
                onClick={() => {
                  setMessage("What technologies do you work with?");
                  setTimeout(() => sendMessage(), 0);
                }}
              >
                What technologies do you work with?
              </button>
              <button 
                className={styles.suggestionBtn}
                onClick={() => {
                  setMessage("Tell me about your experience at Chiliz");
                  setTimeout(() => sendMessage(), 0);
                }}
              >
                Tell me about your experience at Chiliz
              </button>
              <button 
                className={styles.suggestionBtn}
                onClick={() => {
                  setMessage("What kind of projects have you built?");
                  setTimeout(() => sendMessage(), 0);
                }}
              >
                What kind of projects have you built?
              </button>
            </div>
          </div>
        )}

        {history.map((m, i) => (
          <div key={i} className={`${styles.message} ${m.role === "user" ? styles.user : styles.assistant}`}>
            <div className={styles.messageAvatar}>
              {m.role === "user" ? "You" : "AI"}
            </div>
            <div className={styles.messageContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageAvatar}>AI</div>
            <div className={styles.messageContent}>
              {streamingMessage ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamingMessage}
                </ReactMarkdown>
              ) : (
                <div className={styles.typingIndicator}>
                  <Loader2 className={styles.spinner} size={16} />
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className={styles.inputContainer}>
        <form onSubmit={sendMessage} className={styles.inputForm}>
          <input
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question here..."
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={loading || !message.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
