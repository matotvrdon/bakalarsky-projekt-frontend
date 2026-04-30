import { createBrowserRouter } from "react-router";

import { Root } from "./pages/Root.tsx";

import { Home } from "./pages/Home.tsx";
import { Committees } from "./pages/Committees.tsx";
import { Schedule } from "./pages/Schedule.tsx";
import { Submissions } from "./pages/Submissions.tsx";
import { Login } from "./pages/Login.tsx";
import { AdminLogin } from "./pages/AdminLogin.tsx";
import { Registration } from "./pages/Registration.tsx";
import { Public } from "./pages/Public.tsx";
import { Admin } from "./pages/Admin.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { ConferenceSelection } from "./pages/ConferenceSelection.tsx";
import { ConferencePreview } from "./pages/ConferencePreview.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ConferenceSelection },
      { path: "selection", Component: ConferenceSelection },

      { path: "conference/:conferenceId", Component: Home },
      { path: "conference/:conferenceId/committees", Component: Committees },
      { path: "conference/:conferenceId/schedule", Component: Schedule },
      { path: "conference/:conferenceId/submissions", Component: Submissions },
      { path: "conference/:conferenceId/register", Component: Registration },

      { path: "login", Component: Login },
      { path: "admin-login", Component: AdminLogin },

      { path: "dashboard", Component: Public },
      { path: "admin", Component: Admin },

      {
        path: "admin/conferences/:conferenceId/preview",
        Component: ConferencePreview,
        children: [
          { index: true, Component: Home },
          { path: "committees", Component: Committees },
          { path: "schedule", Component: Schedule },
          { path: "submissions", Component: Submissions },
          { path: "register", Component: Registration },
        ],
      },

      { path: "*", Component: NotFound },
    ],
  },
]);