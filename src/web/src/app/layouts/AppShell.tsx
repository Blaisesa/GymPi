import { Outlet } from "react-router";

import { BottomNavigation } from "../navigation/BottomNavigation";
import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header className={styles.header}>
        <span className={styles.brand}>GymPi</span>
      </header>

      <main className={styles.content} id="main-content">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}