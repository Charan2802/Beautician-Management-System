import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import MonthlyTargets from "./pages/MonthlyTargets";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* CLIENTS */}
          <Route
            path="clients"
            element={<Clients />}
          />

          {/* APPOINTMENTS */}
          <Route
            path="appointments"
            element={<Appointments />}
          />

          {/* PAYMENTS */}
          <Route
            path="payments"
            element={<Payments />}
          />

          {/* REPORTS */}
          <Route
            path="reports"
            element={<Reports />}
          />

          {/* ATTENDANCE */}
          <Route
            path="attendance"
            element={<Attendance />}
          />

          {/* LEAVES */}
          <Route
            path="leaves"
            element={<Leaves />}
          />

          {/* PAYROLL */}
          <Route
            path="payroll"
            element={<Payroll />}
          />

          {/* PROFILE */}
          <Route
            path="profile"
            element={<Profile />}
          />

          {/* ADMIN ONLY */}
          <Route
            path="employees"
            element={
              <RoleRoute
                allowedRoles={["Admin"]}
              >
                <Employees />
              </RoleRoute>
            }
          />

          <Route
            path="targets"
            element={
              <RoleRoute
                allowedRoles={["Admin"]}
              >
                <MonthlyTargets />
              </RoleRoute>
            }
          />

          {/* OPTIONAL ALIAS */}
          <Route
            path="monthly-targets"
            element={<MonthlyTargets />}
          />

        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;