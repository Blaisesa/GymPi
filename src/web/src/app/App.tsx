import styles from "./App.module.css";

export function App() {
  return (
    <main className={styles.page}>
      <section
        aria-labelledby="application-title"
        className={styles.introduction}
      >
        <p className={styles.eyebrow}>Private household fitness</p>
        <h1 id="application-title">GymPi</h1>
        <p className={styles.description}>
          The mobile-first application foundation is ready.
        </p>
      </section>
    </main>
  );
}