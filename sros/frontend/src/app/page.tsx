"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  // Service monitoring states
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [dbStatus, setDbStatus] = useState<"checking" | "online" | "offline">("checking");
  
  // Document parser states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Chat states
  const [chatQuery, setChatQuery] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: "assistant", content: "Welcome to SROS Workspace. How can I assist you with your document repositories today?" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Settings
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Check statuses on mount
  useEffect(() => {
    async function checkSystemHealth() {
      try {
        const healthRes = await fetch(`${API_URL}/health`);
        if (healthRes.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch (err) {
        setBackendStatus("offline");
      }

      try {
        const dbRes = await fetch(`${API_URL}/db-status`);
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          if (dbData.database === "connected") {
            setDbStatus("online");
          } else {
            setDbStatus("offline");
          }
        } else {
          setDbStatus("offline");
        }
      } catch (err) {
        setDbStatus("offline");
      }
    }

    checkSystemHealth();
    // Poll health status every 15 seconds
    const interval = setInterval(checkSystemHealth, 15000);
    return () => clearInterval(interval);
  }, [API_URL]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Handle document file upload/parse
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setIsUploading(true);
    setUploadResult(`Initiating parse for file: ${file.name}...\nSize: ${(file.size / 1024).toFixed(2)} KB\nType: ${file.type || "unknown"}`);

    // Create Form Data
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Perform upload to backend documents API
      const res = await fetch(`${API_URL}/api/v1/documents/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUploadResult((prev) => 
          `${prev}\n\n[SUCCESS] Document parsed successfully!\nDocument ID: ${data.document_id}\nStatus: ${data.status}\n\nRunning post-parse layout analysis... done.`
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Server rejected document parsing.");
      }
    } catch (err: any) {
      // Fallback fallback mock if backend is not running
      setTimeout(() => {
        setUploadResult((prev) => 
          `${prev}\n\n[FALLBACK DEV MODE]\nFastAPI backend connection not detected. Simulating local parse:\n- Running PyMuPDF layout parser... done.\n- Text extraction: 100% complete.\n- Created vector placeholders... done.\n- Document ID: doc-mock-${Math.floor(Math.random() * 100000)}`
        );
      }, 1500);
    } finally {
      setTimeout(() => setIsUploading(false), 1500);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle chat messaging
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMsg = chatQuery.trim();
    setChatQuery("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsChatSending(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [
          ...prev, 
          { role: "assistant", content: data.response }
        ]);
      } else {
        throw new Error("Failed to reach chat handler.");
      }
    } catch (err) {
      // Fallback mock messaging if backend is offline
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { 
            role: "assistant", 
            content: `[DEMO MODE] This is a local mock response. When the FastAPI service is active, this query is routed through LangGraph to index embeddings and query PostgreSQL and Qdrant. You queried: "${userMsg}"` 
          }
        ]);
        setIsChatSending(false);
      }, 800);
      return;
    }
    setIsChatSending(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logoGlow}></div>
          <h1 className={styles.logoTitle}>SROS</h1>
        </div>
        <nav className={styles.navLinks}>
          <a href="/docs" target="_blank">Architecture & Docs</a>
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow}></div>
        <span className={styles.heroTagline}>Enterprise Workspace</span>
        <h2 className={styles.heroTitle}>Smart Repository Operating System</h2>
        <p className={styles.heroDesc}>
          Phase 1 Foundation Workspace. Orchestrates AI-augmented document extraction,
          long-term contextual memory, semantic graphs, and dataset analysis.
        </p>
      </section>

      {/* Status Monitor Panel */}
      <section className={styles.monitorPanel}>
        <div className={styles.monitorCard}>
          <div className={styles.monitorInfo}>
            <span className={styles.monitorLabel}>Frontend Host</span>
            <span className={styles.monitorValue}>React + Next.js</span>
          </div>
          <div className={styles.statusIndicator}>
            <div className={`${styles.statusDot} ${styles.online}`}></div>
            <span>Online</span>
          </div>
        </div>

        <div className={styles.monitorCard}>
          <div className={styles.monitorInfo}>
            <span className={styles.monitorLabel}>Backend Gateway</span>
            <span className={styles.monitorValue}>FastAPI Service</span>
          </div>
          <div className={styles.statusIndicator}>
            <div 
              className={`${styles.statusDot} ${
                backendStatus === "online" ? styles.online : 
                backendStatus === "checking" ? styles.checking : styles.offline
              }`}
            ></div>
            <span>{backendStatus === "online" ? "Active" : backendStatus === "checking" ? "Verifying..." : "Offline"}</span>
          </div>
        </div>

        <div className={styles.monitorCard}>
          <div className={styles.monitorInfo}>
            <span className={styles.monitorLabel}>Relational DB</span>
            <span className={styles.monitorValue}>PostgreSQL 16</span>
          </div>
          <div className={styles.statusIndicator}>
            <div 
              className={`${styles.statusDot} ${
                dbStatus === "online" ? styles.online : 
                dbStatus === "checking" ? styles.checking : styles.offline
              }`}
            ></div>
            <span>{dbStatus === "online" ? "Connected" : dbStatus === "checking" ? "Resolving..." : "Offline"}</span>
          </div>
        </div>
      </section>

      {/* Feature / Interactive Grid */}
      <section className={styles.featureGrid}>
        
        {/* Document Parser Panel */}
        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>📄</span> Document Processing
            </h3>
            <span className={`${styles.cardTag} ${styles.tagBlue}`}>OCR & Parser</span>
          </div>
          
          <div className={styles.uploadSection}>
            <div className={styles.dropzone} onClick={triggerFileInput}>
              <span style={{ fontSize: "2rem" }}>📤</span>
              <p className={styles.uploadLabel}>
                {isUploading ? "Processing document..." : "Click here to upload research document"}
              </p>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Supports PDF, TXT, CSV, XLSX, SAV
              </span>
              <input 
                type="file" 
                ref={fileInputRef} 
                className={styles.fileInput} 
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            
            {uploadResult && (
              <div className={styles.resultBox}>
                {uploadResult}
              </div>
            )}
          </div>
        </div>

        {/* Chat Assistant Panel */}
        <div className={styles.featureCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>
              <span className={styles.cardIcon}>💬</span> RAG Chat Workspace
            </h3>
            <span className={`${styles.cardTag} ${styles.tagPurple}`}>LangGraph Agent</span>
          </div>
          
          <div className={styles.chatArea}>
            <div className={styles.chatWindow}>
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${styles.chatMessage} ${
                    msg.role === "user" ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isChatSending && (
                <div className={`${styles.chatMessage} ${styles.assistantMessage}`}>
                  Typing query response...
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>
            
            <form onSubmit={handleSendMessage} className={styles.chatInputArea}>
              <input 
                type="text" 
                className={styles.inputField} 
                placeholder="Ask the repository assistant..."
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                disabled={isChatSending}
              />
              <button 
                type="submit" 
                className={`${styles.button} ${isChatSending || !chatQuery.trim() ? styles.buttonDisabled : ""}`}
                disabled={isChatSending || !chatQuery.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        SROS Phase 1 Foundation • Operating System Layer v1.0.0
      </footer>
    </div>
  );
}
