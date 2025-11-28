"use client";

import ResumeSidebar from "./components/ResumeSidebar";
import ChatInterface from "./components/ChatInterface";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.appContainer}>
      <ResumeSidebar />
      <div className={styles.mainContent}>
        <ChatInterface />
      </div>
    </main>
  );
}
