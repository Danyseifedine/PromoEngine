import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import About from "@/pages/About";

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
    element: <About />,
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
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">Dashboard - Coming Soon</div>
      </ProtectedRoute>
    ),
  },
  // Catch all route - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);