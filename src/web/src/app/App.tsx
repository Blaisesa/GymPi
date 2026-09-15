import { Route, Routes } from "react-router";

import { ActiveProfileProvider } from "../features/household-profiles/ActiveProfileProvider";
import { AppShell } from "./layouts/AppShell";
import { AiChatPage } from "../pages/AiChatPage";
import { HomePage } from "../pages/HomePage";
import { HydrationPage } from "../pages/HydrationPage";
import { MetricsPage } from "../pages/MetricsPage";
import { NutritionPage } from "../pages/NutritionPage";
import { WorkoutsPage } from "../pages/WorkoutsPage";

export function App() {
  return (
    <ActiveProfileProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="hydration" element={<HydrationPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="ai-chat" element={<AiChatPage />} />
        </Route>
      </Routes>
    </ActiveProfileProvider>
  );
}
