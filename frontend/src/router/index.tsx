import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

const Dummy = () => {
  return <div>Dummy</div>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/shop",
    // element: <ShopPage />,
  },
  {
    path: "/about",
    // element: <AboutPage />,
  },
  {
    path: "/contact",
    // element: <ContactPage />,
  },
  {
    path: "/demo",
    // element: <DemoPage />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Dummy />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Dummy />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dummy />
      </ProtectedRoute>
    ),
  },
  // Catch all route - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);