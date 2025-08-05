import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminDashboard from "@/pages/admin/Dashboard";
import { PublicRoute } from "./middleware/GuestMiddleware";
import About from "@/pages/About";
import { AdminRoute } from "./middleware/AdminMiddleware";

// Custom AdminRoute to allow only admin users


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/shop",
    element:
      <div>Shop</div>,
  },
  {
    path: "/about",
    element: <About />,
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
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  // Catch all route - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);