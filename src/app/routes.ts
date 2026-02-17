import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root.tsx";
import { Home } from "./pages/Home.tsx";
import { About } from "./pages/About.tsx";
import { Schedule } from "./pages/Schedule.tsx";
import { Speakers } from "./pages/Speakers.tsx";
import { Submissions } from "./pages/Submissions.tsx";
import { Registration } from "./pages/RegistrationSimple.tsx";
import { Login } from "./pages/Login.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Admin } from "./pages/AdminPanel.tsx";
import { NotFound } from "./pages/NotFound.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "schedule", Component: Schedule },
      { path: "speakers", Component: Speakers },
      { path: "submissions", Component: Submissions },
      { path: "register", Component: Registration },
      { path: "login", Component: Login },
      { path: "dashboard", Component: Dashboard },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound },
    ],
  },
]);