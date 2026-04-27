import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root.tsx";
import { Home } from "../pages/Home.tsx";
import { Committees } from "../pages/Committees.tsx";
import { Schedule } from "../pages/Schedule.tsx";
import { Submissions } from "../pages/Submissions.tsx";
import { Registration } from "./pages/RegistrationSimple.tsx";
import { Login } from "./pages/Login.tsx";
import { Public } from "../pages/Public.tsx";
import { Admin } from "../pages/Admin.tsx";
import { NotFound } from "../pages/NotFound.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "committees", Component: Committees },
      { path: "schedule", Component: Schedule },
      { path: "submissions", Component: Submissions },
      { path: "register", Component: Registration },
      { path: "login", Component: Login },
      { path: "dashboard", Component: Public },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound },
    ],
  },
]);