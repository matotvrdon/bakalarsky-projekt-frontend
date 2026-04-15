import { createBrowserRouter } from "react-router";
import type { ComponentType } from "react";

const lazyComponent = <T extends Record<string, unknown>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) => {
  return async () => {
    const module = await loader();
    return { Component: module[exportName] as ComponentType };
  };
};

export const nextRouter = createBrowserRouter([
  {
    path: "/",
    lazy: lazyComponent(() => import("../features/public/pages/root-page"), "RootPage"),
    children: [
      {
        index: true,
        lazy: lazyComponent(() => import("../features/public/pages/home-page"), "HomePage"),
      },
      {
        path: "committees",
        lazy: lazyComponent(
          () => import("../features/public/pages/committees-page"),
          "CommitteesPage",
        ),
      },
      {
        path: "schedule",
        lazy: lazyComponent(
          () => import("../features/public/pages/schedule-page"),
          "SchedulePage",
        ),
      },
      {
        path: "submissions",
        lazy: lazyComponent(
          () => import("../features/public/pages/submissions-page"),
          "SubmissionsPage",
        ),
      },
      {
        path: "register",
        lazy: lazyComponent(
          () => import("../features/auth/pages/registration-page"),
          "RegistrationPage",
        ),
      },
      {
        path: "login",
        lazy: lazyComponent(() => import("../features/auth/pages/login-page"), "LoginPage"),
      },
      {
        path: "dashboard",
        lazy: lazyComponent(
          () => import("../features/legacy/pages/dashboard-page"),
          "DashboardPage",
        ),
      },
      {
        path: "admin",
        lazy: lazyComponent(() => import("../features/legacy/pages/admin-page"), "AdminPage"),
      },
      {
        path: "*",
        lazy: lazyComponent(
          () => import("../features/misc/pages/not-found-page"),
          "NotFoundPage",
        ),
      },
    ],
  },
]);
