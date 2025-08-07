import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminDashboard from "@/pages/admin/Dashboard";
import { PublicRoute } from "./middleware/GuestMiddleware";
import About from "@/pages/About";
import { AdminRoute } from "./middleware/AdminMiddleware";
import UsersPage from "@/pages/admin/UsersManagement";
import CategoriesPage from "@/pages/admin/Categories";
import ProductsPage from "@/pages/admin/Products";
import PromotionsPage from "@/pages/admin/Promotions";
import EnginePage from "@/pages/admin/Engine";
import ShopPage from "@/pages/Shop";
import CheckoutPage from "@/pages/Checkout";
import { ProtectedRoute } from "./middleware/AuthMiddleware";

// Custom AdminRoute to allow only admin users


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/shop",
    element: (
      <ProtectedRoute>
        <ShopPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
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
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <UsersPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/categories",
    element: (
      <AdminRoute>
        <CategoriesPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/products",
    element: (
      <AdminRoute>
        <ProductsPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/promotions",
    element: (
      <AdminRoute>
        <PromotionsPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/engine",
    element: (
      <AdminRoute>
        <EnginePage />
      </AdminRoute>
    ),
  },

  // Catch all route - redirect to home
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);