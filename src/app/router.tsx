import HomePage from "@/pages/Home";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);
export default router;
