import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserCatalog from "./pages/UserCatalog";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/catalog",
    Component: UserCatalog,
  },
]);
