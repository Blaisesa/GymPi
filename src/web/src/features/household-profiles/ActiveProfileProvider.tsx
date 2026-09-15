import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { ActiveProfileContext } from "./ActiveProfileContext";

const activeProfileStorageKey = "gympi.activeProfileId";

export function ActiveProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() =>
    localStorage.getItem(activeProfileStorageKey),
  );

  const selectActiveProfile = useCallback((profileId: string | null) => {
    setActiveProfileId(profileId);

    if (profileId === null) {
      localStorage.removeItem(activeProfileStorageKey);
    } else {
      localStorage.setItem(activeProfileStorageKey, profileId);
    }
  }, []);

  const value = useMemo(
    () => ({ activeProfileId, selectActiveProfile }),
    [activeProfileId, selectActiveProfile],
  );

  return (
    <ActiveProfileContext.Provider value={value}>
      {children}
    </ActiveProfileContext.Provider>
  );
}
