import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";

import api from "../api/axios";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    totalClients: 0,
    totalEmployees: 0,
    todayAppointments: [],
    recentPayments: [],
    monthlyTarget: 0,
    monthlyActual: 0,
  });

  const [loading, setLoading] = useState(true);

 useEffect(() => {
   fetchDashboard();
}, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard");

      const data = res.data || {};

      setDashboard({
        totalRevenue: data.totalRevenue || 0,
        totalAppointments: data.totalAppointments || 0,
        totalClients: data.totalClients || 0,
        totalEmployees: data.totalEmployees || 0,
        todayAppointments: data.todayAppointments || [],
        recentPayments: data.recentPayments || [],
        monthlyTarget: data.monthlyTarget || 0,
        monthlyActual: data.monthlyActual || 0,
      });

    } catch (err) {
      console.log("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const progress =
    dashboard.monthlyTarget > 0
      ? Math.round(
          (dashboard.monthlyActual / dashboard.monthlyTarget) * 100
        )
      : 0;

  if (loading) {
    return (
      <Box p={4}>
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "#fafafa",
      }}
    >
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Beauty Salon Dashboard
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Welcome back! Here's your business overview
      </Typography>

      {/* KPI CARDS */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{dashboard.totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

       <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">
                Appointments
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dashboard.totalAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">
                Clients
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dashboard.totalClients}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">
                Employees
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {dashboard.totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* PROGRESS SECTION */}
      <Card sx={{ mt: 4, borderRadius: 4, p: 2 }}>
        <Typography fontWeight="bold">
          Monthly Target Progress
        </Typography>

        <Typography color="text.secondary" mt={1}>
          ₹{dashboard.monthlyActual} / ₹{dashboard.monthlyTarget}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            mt: 2,
          }}
        />

        <Typography mt={1} fontWeight="bold">
          {progress}%
        </Typography>
      </Card>

      {/* ROW: PAYMENTS + APPOINTMENTS */}
      <Grid container spacing={3} mt={3}>
        {/* RECENT PAYMENTS */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>
                Recent Payments
              </Typography>

              {dashboard.recentPayments.length === 0 ? (
                <Typography color="text.secondary">
                  No payments yet
                </Typography>
              ) : (
                dashboard.recentPayments.map((p) => (
                  <Box
                    key={p._id}
                    sx={{ display:"flex", justifyContent:"space-between" }}
                    py={1}
                  >
                    <Typography>
                      {p.client?.clientName}
                    </Typography>
                    <Typography fontWeight="bold">
                      ₹{p.amountPaid}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* TODAY APPOINTMENTS */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>
                Today's Appointments
              </Typography>

              {dashboard.todayAppointments.length === 0 ? (
                <Typography color="text.secondary">
                  No appointments today
                </Typography>
              ) : (
                dashboard.todayAppointments.map((a) => (
                  <Box key={a._id} mb={2}>
                    <Stack direction="row" spacing={2}>
                      <Avatar sx={{ bgcolor: "#c186e9" }}>
                        {a.client?.clientName?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography fontWeight="bold">
                          {a.client?.clientName}
                        </Typography>
                        <Typography color="text.secondary">
                          {a.service}
                        </Typography>
                      </Box>

                      <Box ml="auto">
                        <Typography fontWeight="bold">
                          {a.time}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}