import { Droplets, Plus, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link } from "react-router";

import { useActiveProfile } from "../features/household-profiles/ActiveProfileContext";
import {
  getHydration,
  recordHydrationEntry,
  type HydrationSummary,
} from "../features/hydration/hydrationClient";
import { playWaterDrop } from "../features/hydration/waterDropSound";
import styles from "./HydrationPage.module.css";

const soundStorageKey = "gympi.hydrationSoundEnabled";

export function HydrationPage() {
  const { activeProfileId } = useActiveProfile();
  const [overview, setOverview] = useState<HydrationSummary | null>(null);
  const [loadedProfileId, setLoadedProfileId] = useState<string | null>(null);
  const [failedProfileId, setFailedProfileId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("350");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem(soundStorageKey) !== "false",
  );
  const saveController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (activeProfileId === null) {
      return;
    }

    const controller = new AbortController();

    void getHydration(activeProfileId, 7, controller.signal)
      .then((loadedOverview) => {
        if (!controller.signal.aborted) {
          setOverview(loadedOverview);
          setLoadedProfileId(activeProfileId);
          setFailedProfileId(null);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailedProfileId(activeProfileId);
        }
      });

    return () => {
      controller.abort();
      saveController.current?.abort();
    };
  }, [activeProfileId]);

  async function addWater(amountMl: number) {
    if (activeProfileId === null) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    const controller = new AbortController();
    saveController.current = controller;

    try {
      await recordHydrationEntry(activeProfileId, amountMl, controller.signal);

      if (!controller.signal.aborted) {
        if (soundEnabled) {
          playWaterDrop();
        }
      }

      try {
        const updatedOverview = await getHydration(
          activeProfileId,
          7,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setOverview(updatedOverview);
          setLoadedProfileId(activeProfileId);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSaveError(
            "Water was recorded, but progress could not refresh. Reload GymPi.",
          );
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        setSaveError("Water was not recorded. Please try again.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSaving(false);
      }
    }
  }

  function submitCustomAmount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void addWater(Number(customAmount));
  }

  function toggleSound() {
    const nextSoundEnabled = !soundEnabled;
    setSoundEnabled(nextSoundEnabled);
    localStorage.setItem(soundStorageKey, String(nextSoundEnabled));
  }

  const today = overview?.days.at(-1) ?? null;
  const consumedMl = today?.consumedMl ?? 0;
  const remainingMl = overview
    ? Math.max(0, overview.dailyGoalMl - consumedMl)
    : 0;
  const progress = overview
    ? Math.round((consumedMl / overview.dailyGoalMl) * 100)
    : 0;
  const visualProgress = Math.min(progress, 100);
  const waterStyle = {
    "--water-level": `${visualProgress}%`,
  } as CSSProperties;
  const isCurrentOverview = loadedProfileId === activeProfileId;
  const isLoading = activeProfileId !== null && !isCurrentOverview &&
    failedProfileId !== activeProfileId;
  const hasLoadError = activeProfileId !== null &&
    failedProfileId === activeProfileId;

  return (
    <section aria-labelledby="hydration-title" className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Daily rhythm</p>
          <h1 id="hydration-title">Hydration</h1>
          <p>Small sips, steady progress.</p>
        </div>
        <button
          aria-label={soundEnabled ? "Mute water sounds" : "Enable water sounds"}
          aria-pressed={soundEnabled}
          className={styles.soundButton}
          onClick={toggleSound}
          type="button"
        >
          {soundEnabled ? (
            <Volume2 aria-hidden="true" size={20} />
          ) : (
            <VolumeX aria-hidden="true" size={20} />
          )}
        </button>
      </header>

      {activeProfileId === null ? (
        <div className={styles.emptyState}>
          <Droplets aria-hidden="true" size={32} />
          <p>Choose a household profile first.</p>
          <Link className={styles.primaryLink} to="/">
            Choose profile
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <p aria-live="polite" role="status">
          Loading hydration…
        </p>
      ) : null}

      {hasLoadError ? (
        <p className={styles.error} role="alert">
          Hydration is unavailable. Reload GymPi to try again.
        </p>
      ) : null}

      {activeProfileId !== null && isCurrentOverview && overview ? (
        <>
          <section aria-labelledby="today-title" className={styles.todayCard}>
            <div className={styles.todayCopy}>
              <p className={styles.eyebrow}>Today</p>
              <h2 id="today-title">Keep your flow</h2>
              <div aria-hidden="true" className={styles.heroAmount}>
                {new Intl.NumberFormat().format(consumedMl)}
                <span>ml</span>
              </div>
              <p aria-live="polite" className={styles.total}>
                {new Intl.NumberFormat().format(consumedMl)} of{" "}
                {new Intl.NumberFormat().format(overview.dailyGoalMl)} ml
              </p>
              <p className={styles.remaining}>
                {remainingMl > 0
                  ? `${new Intl.NumberFormat().format(remainingMl)} ml to go`
                  : "Daily goal reached"}
              </p>
            </div>

            <div className={styles.tankStage}>
              <div
                aria-label="Daily hydration"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={visualProgress}
                aria-valuetext={`${consumedMl} of ${overview.dailyGoalMl} ml`}
                className={styles.vessel}
                data-empty={consumedMl === 0}
                role="progressbar"
                style={waterStyle}
              >
                <div aria-hidden="true" className={styles.water}>
                  <svg
                    className={styles.wave}
                    key={consumedMl}
                    viewBox="0 0 400 24"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 12 Q50 0 100 12 T200 12 T300 12 T400 12 V24 H0 Z" />
                  </svg>
                  <span className={styles.waterSurface} />
                </div>
                <div aria-hidden="true" className={styles.tankScale}>
                  {[75, 50, 25].map((mark) => (
                    <span key={mark} style={{ bottom: `${mark}%` }}>
                      {mark}
                    </span>
                  ))}
                </div>
                <span className={styles.percentage}>
                  <Droplets aria-hidden="true" size={22} />
                  <strong>
                    {progress}<small>%</small>
                  </strong>
                  <span>of daily goal</span>
                </span>
              </div>
              <div aria-hidden="true" className={styles.tankBase} />
            </div>
            <div className={styles.todayFooter}>
              <Droplets aria-hidden="true" size={16} />
              <span>
                {overview.todayEntries.length}{" "}
                {overview.todayEntries.length === 1 ? "drink" : "drinks"} recorded
              </span>
              <span className={styles.goalLabel}>
                Goal · {new Intl.NumberFormat().format(overview.dailyGoalMl)} ml
              </span>
            </div>
          </section>

          <section
            aria-labelledby="hydration-week-title"
            className={styles.weekCard}
            role="region"
          >
            <div>
              <p className={styles.eyebrow}>Seven-day view</p>
              <h2 id="hydration-week-title">Last seven days</h2>
            </div>
            <div className={styles.weekChart}>
              {overview.days.map((day, index) => {
                const barProgress = Math.min(
                  Math.round((day.consumedMl / overview.dailyGoalMl) * 100),
                  100,
                );
                const isToday = index === overview.days.length - 1;

                return (
                  <div className={styles.day} key={day.localDate}>
                    <div
                      aria-label={`${day.localDate}: ${day.consumedMl} ml`}
                      aria-valuemax={overview.dailyGoalMl}
                      aria-valuemin={0}
                      aria-valuenow={Math.min(
                        day.consumedMl,
                        overview.dailyGoalMl,
                      )}
                      aria-valuetext={`${day.consumedMl} ml`}
                      className={styles.dayTrack}
                      role="meter"
                    >
                      <span
                        className={styles.dayBar}
                        style={{ "--day-progress": `${barProgress}%` } as CSSProperties}
                      />
                    </div>
                    <span className={styles.dayLabel}>
                      {isToday
                        ? "Today"
                        : new Intl.DateTimeFormat(undefined, {
                            weekday: "narrow",
                            timeZone: "UTC",
                          }).format(new Date(`${day.localDate}T12:00:00Z`))}
                    </span>
                    <span className={styles.dayValue}>
                      {day.consumedMl === 0
                        ? "0 L"
                        : `${(day.consumedMl / 1000).toLocaleString(undefined, {
                            maximumFractionDigits: 1,
                          })} L`}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="quick-add-title" className={styles.addCard}>
            <div>
              <p className={styles.eyebrow}>Quick add</p>
              <h2 id="quick-add-title">Log a drink</h2>
            </div>

            <div className={styles.quickActions}>
              {[250, 500].map((amountMl) => (
                <button
                  aria-label={`Add ${amountMl} ml`}
                  className={styles.quickButton}
                  disabled={isSaving}
                  key={amountMl}
                  onClick={() => void addWater(amountMl)}
                  type="button"
                >
                  <Droplets aria-hidden="true" size={22} />
                  <span className={styles.quickButtonCopy}>
                    <strong>{amountMl} ml</strong>
                    <span>{amountMl === 250 ? "Small glass" : "Large glass"}</span>
                  </span>
                  <Plus aria-hidden="true" size={18} />
                </button>
              ))}
            </div>

            <form className={styles.customForm} onSubmit={submitCustomAmount}>
              <label htmlFor="custom-hydration-amount">Custom amount</label>
              <div className={styles.customControl}>
                <input
                  id="custom-hydration-amount"
                  max={5000}
                  min={1}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  required
                  type="number"
                  value={customAmount}
                />
                <span>ml</span>
                <button disabled={isSaving} type="submit">
                  {isSaving ? "Saving…" : "Add"}
                </button>
              </div>
            </form>

            {saveError ? (
              <p className={styles.error} role="alert">
                {saveError}
              </p>
            ) : null}
          </section>

          <section
            aria-labelledby="today-history-title"
            className={styles.historyCard}
            role="region"
          >
            <p className={styles.eyebrow}>Entries</p>
            <h2 id="today-history-title">Today&apos;s history</h2>

            {overview.todayEntries.length === 0 ? (
              <p>No water recorded yet.</p>
            ) : (
              <ol className={styles.entryList}>
                {overview.todayEntries.map((entry) => (
                  <li key={entry.id}>
                    <Droplets aria-hidden="true" className={styles.entryIcon} size={18} />
                    <span>{entry.amountMl} ml</span>
                    <time dateTime={entry.consumedAtUtc}>
                      {new Intl.DateTimeFormat(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: overview.timeZoneId,
                      }).format(new Date(entry.consumedAtUtc))}
                    </time>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}
