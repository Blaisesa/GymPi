import { Route, Routes } from "react-router";

import { AppShell } from "./layouts/AppShell";
import { AiChatPage } from "../pages/AiChatPage";
import { HomePage } from "../pages/HomePage";
import { MetricsPage } from "../pages/MetricsPage";
import { NutritionPage } from "../pages/NutritionPage";
import { WorkoutsPage } from "../pages/WorkoutsPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="workouts" element={<WorkoutsPage />} />
        <Route path="nutrition" element={<NutritionPage />} />
        <Route path="ai-chat" element={<AiChatPage />} />
      </Route>
    </Routes>
  );
}