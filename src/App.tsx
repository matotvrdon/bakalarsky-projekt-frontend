import { RouterProvider } from 'react-router';
import { Toaster } from "sonner";
import { router } from './routes.ts';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
