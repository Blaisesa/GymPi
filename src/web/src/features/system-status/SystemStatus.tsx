import { useEffect, useState } from "react";

import { getSystemHealth } from "./systemHealthClient";
import styles from "./SystemStatus.module.css";

type ConnectionState = "checking" | "connected" | "unavailable";

const messages: Record<ConnectionState, string> = {
  checking: "Checking connection…",
  connected: "Connected",
  unavailable: "Unavailable",
};

export function SystemStatus() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("checking");

  useEffect(() => {
    const controller = new AbortController();

    void getSystemHealth(controller.signal)
      .then(() => {
        if (!controller.signal.aborted) {
          setConnectionState("connected");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setConnectionState("unavailable");
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section
      aria-labelledby="system-status-title"
      className={styles.card}
    >
      <h2 className={styles.heading} id="system-status-title">
        System status
      </h2>
      <div
        aria-live="polite"
        className={`${styles.status} ${styles[connectionState]}`}
        role="status"
      >
        <span aria-hidden="true" className={styles.dot} />
        {messages[connectionState]}
      </div>
    </section>
  );
}
