import { ArrowRight, Droplets } from "lucide-react";
import { Link } from "react-router";

import { HouseholdProfiles } from "../features/household-profiles/HouseholdProfiles";
import { SystemStatus } from "../features/system-status/SystemStatus";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">Home</h1>
      <p>Your daily overview will be built here.</p>
      <Link aria-label="Track hydration" className={styles.hydrationCard} to="/hydration">
        <span className={styles.icon}>
          <Droplets aria-hidden="true" size={24} />
        </span>
        <span>
          <small>Daily rhythm</small>
          <strong>Track hydration</strong>
        </span>
        <ArrowRight aria-hidden="true" size={20} />
      </Link>
      <HouseholdProfiles />
      <SystemStatus />
    </section>
  );
}
