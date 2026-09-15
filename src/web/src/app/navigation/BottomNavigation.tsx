import {
  Activity,
  Dumbbell,
  House,
  MessageCircle,
  Utensils,
} from "lucide-react";
import { matchPath, NavLink, useLocation } from "react-router";

import styles from "./BottomNavigation.module.css";

const navigationItems = [
  { icon: House, label: "Home", to: "/" },
  { icon: Activity, label: "Metrics", to: "/metrics" },
  { icon: Dumbbell, label: "Workouts", to: "/workouts" },
  { icon: Utensils, label: "Nutrition", to: "/nutrition" },
  { icon: MessageCircle, label: "AI Chat", to: "/ai-chat" },
];

export function BottomNavigation() {
  const { pathname } = useLocation();
  const centreIndex = Math.floor(navigationItems.length / 2);
  const activeIndex = navigationItems.findIndex((item) =>
    matchPath(
      {
        path: item.to,
        end: item.to === "/",
        caseSensitive: false,
      },
      pathname,
    ),
  );

  return (
    <nav aria-label="Primary" className={styles.navigation}>
      <div className={styles.track}>
        <ul className={styles.list}>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isCentre = index === centreIndex;

            return (
              <li className={styles.item} key={item.to}>
                <NavLink
                  aria-label={item.label}
                  className={({ isActive }) =>
                    [
                      styles.link,
                      isCentre ? styles.centre : "",
                      isActive ? styles.active : "",
                    ]
                      .filter(Boolean)
                      .join(" ")
                  }
                  end={item.to === "/"}
                  to={item.to}
                >
                  <span className={styles.symbol}>
                    <Icon
                      aria-hidden="true"
                      focusable="false"
                      size={22}
                      strokeWidth={1.8}
                    />
                  </span>

                  {!isCentre && (
                    <span aria-hidden="true" className={styles.label}>
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {activeIndex >= 0 && (
          <span
            aria-hidden="true"
            className={styles.indicator}
            style={{
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />
        )}
      </div>
    </nav>
  );
}