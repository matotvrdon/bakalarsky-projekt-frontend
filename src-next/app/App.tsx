import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import { nextRouter } from "./routes";

export default function AppNext() {
  return (
    <>
      <RouterProvider router={nextRouter} />
      <Toaster richColors position="top-right" />
    </>
  );
}
