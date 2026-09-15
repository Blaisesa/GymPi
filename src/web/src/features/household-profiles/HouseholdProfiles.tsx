import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  createProfile,
  listProfiles,
  type HouseholdProfile,
} from "./profileClient";
import styles from "./HouseholdProfiles.module.css";

const activeProfileStorageKey = "gympi.activeProfileId";

type LoadState = "loading" | "ready" | "error";

function defaultTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Dublin";
}

export function HouseholdProfiles() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [profiles, setProfiles] = useState<HouseholdProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [timeZoneId, setTimeZoneId] = useState(defaultTimeZone);
  const [dailyHydrationGoalMl, setDailyHydrationGoalMl] = useState("2500");
  const createController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void listProfiles(controller.signal)
      .then((loadedProfiles) => {
        if (controller.signal.aborted) {
          return;
        }

        setProfiles(loadedProfiles);
        setLoadState("ready");
        setIsAdding(loadedProfiles.length === 0);

        const savedProfileId = localStorage.getItem(activeProfileStorageKey);
        const selectedProfile = loadedProfiles.find(
          (profile) => profile.id === savedProfileId,
        );
        const nextProfileId = selectedProfile?.id ?? loadedProfiles[0]?.id ?? null;

        setActiveProfileId(nextProfileId);

        if (nextProfileId === null) {
          localStorage.removeItem(activeProfileStorageKey);
        } else {
          localStorage.setItem(activeProfileStorageKey, nextProfileId);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadState("error");
        }
      });

    return () => {
      controller.abort();
      createController.current?.abort();
    };
  }, []);

  const activeProfile = profiles.find(
    (profile) => profile.id === activeProfileId,
  );

  function selectProfile(profileId: string) {
    setActiveProfileId(profileId);
    localStorage.setItem(activeProfileStorageKey, profileId);
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreationError(null);
    setIsSubmitting(true);

    const controller = new AbortController();
    createController.current = controller;

    try {
      const profile = await createProfile(
        {
          displayName,
          timeZoneId,
          dailyHydrationGoalMl: Number(dailyHydrationGoalMl),
        },
        controller.signal,
      );

      setProfiles((currentProfiles) => [...currentProfiles, profile]);
      selectProfile(profile.id);
      setDisplayName("");
      setIsAdding(false);
    } catch {
      if (!controller.signal.aborted) {
        setCreationError("Profile could not be created. Check the details and try again.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <section aria-labelledby="household-profiles-title" className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Household</p>
          <h2 className={styles.heading} id="household-profiles-title">
            Profiles
          </h2>
        </div>

        {profiles.length > 0 && !isAdding ? (
          <button
            className={styles.secondaryButton}
            onClick={() => setIsAdding(true)}
            type="button"
          >
            Add profile
          </button>
        ) : null}
      </div>

      {loadState === "loading" ? (
        <p aria-live="polite" className={styles.message} role="status">
          Loading profiles…
        </p>
      ) : null}

      {loadState === "error" ? (
        <p className={styles.error} role="alert">
          Profiles are unavailable. Reload GymPi to try again.
        </p>
      ) : null}

      {loadState === "ready" && profiles.length > 0 ? (
        <div className={styles.profileSummary}>
          <label className={styles.label} htmlFor="active-profile">
            Active profile
          </label>
          <select
            className={styles.control}
            id="active-profile"
            onChange={(event) => selectProfile(event.target.value)}
            value={activeProfileId ?? ""}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.displayName}
              </option>
            ))}
          </select>

          {activeProfile ? (
            <dl className={styles.details}>
              <div>
                <dt>Hydration goal</dt>
                <dd>
                  {new Intl.NumberFormat().format(
                    activeProfile.dailyHydrationGoalMl,
                  )}{" "}
                  ml
                </dd>
              </div>
              <div>
                <dt>Time zone</dt>
                <dd>{activeProfile.timeZoneId}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      ) : null}

      {loadState === "ready" && isAdding ? (
        <form className={styles.form} onSubmit={submitProfile}>
          <p className={styles.formTitle}>
            {profiles.length === 0 ? "Create first profile" : "Add profile"}
          </p>

          <label className={styles.label} htmlFor="profile-display-name">
            Display name
          </label>
          <input
            autoComplete="name"
            className={styles.control}
            id="profile-display-name"
            maxLength={80}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            value={displayName}
          />

          <label className={styles.label} htmlFor="profile-time-zone">
            Time zone
          </label>
          <input
            className={styles.control}
            id="profile-time-zone"
            maxLength={100}
            onChange={(event) => setTimeZoneId(event.target.value)}
            required
            value={timeZoneId}
          />

          <label className={styles.label} htmlFor="profile-hydration-goal">
            Daily hydration goal
          </label>
          <input
            aria-describedby="hydration-goal-unit"
            className={styles.control}
            id="profile-hydration-goal"
            max={10000}
            min={250}
            onChange={(event) => setDailyHydrationGoalMl(event.target.value)}
            required
            step={50}
            type="number"
            value={dailyHydrationGoalMl}
          />
          <span className={styles.help} id="hydration-goal-unit">
            Millilitres per day
          </span>

          {creationError ? (
            <p className={styles.error} role="alert">
              {creationError}
            </p>
          ) : null}

          <div className={styles.actions}>
            {profiles.length > 0 ? (
              <button
                className={styles.secondaryButton}
                disabled={isSubmitting}
                onClick={() => setIsAdding(false)}
                type="button"
              >
                Cancel
              </button>
            ) : null}
            <button
              className={styles.primaryButton}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating…" : "Create profile"}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
