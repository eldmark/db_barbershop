import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/employee/DashboardPage";
import ProductsPage from "../pages/employee/ProductsPage";
import ProductEditPage from "../pages/employee/ProductEditPage";
import ServicesPage from "../pages/employee/ServicesPage";
import SalesPage from "../pages/employee/SalesPage";
import ReservationsPage from "../pages/employee/ReservationsPage";
import ReservationEditPage from "../pages/employee/ReservationEditPage";
import HomePage from "../pages/client/HomePage";
import ClientServicesPage from "../pages/client/ServicesPage";
import ClientReservationsPage from "../pages/client/ReservationsPage";
import NotFoundPage from "../pages/NotFoundPage";
import AccessDeniedPage from "../pages/AccessDeniedPage";
import AppShell from "../components/layout/AppShell";
import ClientShell from "../components/layout/ClientShell";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

const staffRoles = ["admin_role", "manager_role", "employee_role", "cashier_role", "admin", "employee"];
const clientRoles = ["client_role", "client"];

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="app-container">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ allow, children }: { allow: string[]; children: JSX.Element }) {
  const { hasRole } = useAuth();
  if (!hasRole(allow)) return <Navigate to="/forbidden" replace />;
  return children;
}

function ServicesRoute() {
  const { hasRole } = useAuth();
  if (hasRole(staffRoles)) {
    return (
      <AppShell>
        <ServicesPage />
      </AppShell>
    );
  }
  if (hasRole(clientRoles)) {
    return (
      <ClientShell>
        <ClientServicesPage />
      </ClientShell>
    );
  }
  return <Navigate to="/forbidden" replace />;
}

function ReservationsRoute() {
  const { hasRole } = useAuth();
  if (hasRole(staffRoles)) {
    return (
      <AppShell>
        <ReservationsPage />
      </AppShell>
    );
  }
  if (hasRole(clientRoles)) {
    return (
      <ClientShell>
        <ClientReservationsPage />
      </ClientShell>
    );
  }
  return <Navigate to="/forbidden" replace />;
}

export default function AppRouter() {
  const { token, user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token && user
              ? user.roles.some((role) => staffRoles.includes(role))
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<AccessDeniedPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <RequireRole allow={staffRoles}>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/products"
          element={
            <RequireAuth>
              <RequireRole allow={staffRoles}>
                <AppShell>
                  <ProductsPage />
                </AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/products/:id"
          element={
            <RequireAuth>
              <RequireRole allow={staffRoles}>
                <AppShell>
                  <ProductEditPage />
                </AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/sales"
          element={
            <RequireAuth>
              <RequireRole allow={staffRoles}>
                <AppShell>
                  <SalesPage />
                </AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/services"
          element={
            <RequireAuth>
              <ServicesRoute />
            </RequireAuth>
          }
        />
        <Route
          path="/reservations"
          element={
            <RequireAuth>
              <ReservationsRoute />
            </RequireAuth>
          }
        />
        <Route
          path="/reservations/:id"
          element={
            <RequireAuth>
              <RequireRole allow={staffRoles}>
                <AppShell>
                  <ReservationEditPage />
                </AppShell>
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/home"
          element={
            <RequireAuth>
              <RequireRole allow={clientRoles}>
                <ClientShell>
                  <HomePage />
                </ClientShell>
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
