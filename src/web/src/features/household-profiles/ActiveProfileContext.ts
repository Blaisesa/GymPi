import { createContext, useContext } from "react";

export interface ActiveProfileValue {
  activeProfileId: string | null;
  selectActiveProfile: (profileId: string | null) => void;
}

export const ActiveProfileContext = createContext<
  ActiveProfileValue | undefined
>(undefined);

export function useActiveProfile(): ActiveProfileValue {
  const value = useContext(ActiveProfileContext);

  if (value === undefined) {
    throw new Error("useActiveProfile must be used inside ActiveProfileProvider.");
  }

  return value;
}
