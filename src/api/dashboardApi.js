import api from "./axios";

// Dashboard summary
export const getDashboardSummary = () =>
  api.get("/dashboard/summary");

// Monthly target progress
export const getMonthlyTargets = () =>
  api.get("/monthly-targets");

// Appointments today
export const getTodayAppointments = () =>
  api.get("/dashboard/today-appointments");