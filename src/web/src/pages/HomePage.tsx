import { HouseholdProfiles } from "../features/household-profiles/HouseholdProfiles";
import { SystemStatus } from "../features/system-status/SystemStatus";

export function HomePage() {
  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">Home</h1>
      <p>Your daily overview will be built here.</p>
      <HouseholdProfiles />
      <SystemStatus />
    </section>
  );
}
