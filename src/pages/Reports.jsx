import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  TextField,
  Button,
  LinearProgress,
} from "@mui/material";

import api from "../api/axios";

export default function Reports() {
  const [summary, setSummary] = useState({
    monthlyRevenue: 0,
    monthlyAppointments: 0,
    netProfit: 0,
    taxDeduction: 0,
  });

  const [serviceRevenue, setServiceRevenue] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [targets, setTargets] = useState([]);

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  useEffect(() => {
    fetchReports();
  }, [month, year]);

  const fetchReports = async () => {
    try {
      const summaryRes = await api.get(
        "/reports/summary"
      );

      const report = summaryRes.data || {};

      const revenue =
        report.revenue?.totalRevenue || 0;

      setSummary({
        monthlyRevenue: revenue,
        monthlyAppointments:
          report.appointments?.totalAppointments || 0,
        netProfit: Math.round(revenue * 0.8),
        taxDeduction: Math.round(revenue * 0.18),
      });

      try {
        const serviceRes =
          await api.get(
            "/reports/service-revenue"
          );

        setServiceRevenue(
          serviceRes.data?.data || []
        );
      } catch {
        setServiceRevenue([]);
      }

      try {
        const paymentRes =
          await api.get(
            "/reports/payment-methods"
          );

        setPaymentMethods(
          paymentRes.data?.data || []
        );
      } catch {
        setPaymentMethods([]);
      }

      try {
        const targetRes =
          await api.get(
            "/monthly-targets"
          );

        setTargets(
          targetRes.data?.targets || []
        );
      } catch {
        setTargets([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportExcel = async () => {
    try {
      const response =
        await api.get(
          "/reports/export/monthly",
          {
            responseType: "blob",
          }
        );

      const blob =
        new Blob([response.data]);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "Monthly_Report.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const role =
    localStorage.getItem("role");

  if (role !== "Admin") {
    return (
      <Typography color="error">
        Access Denied
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#ffffff,#fafafa,#f5f5f5)",
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          color: "#cf7d63",
          mb: 1,
        }}
      >
        Reports & Analytics
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Premium business insights dashboard
      </Typography>

      {/* FILTERS */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 5,
          boxShadow:
            "0 10px 30px rgba(0,0,0,.05)",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Month"
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
              >
                {Array.from(
                  { length: 12 },
                  (_, i) => (
                    <MenuItem
                      key={i}
                      value={i + 1}
                    >
                      {i + 1}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Year"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={exportExcel}
                sx={{
                  height: "56px",
                  borderRadius: 3,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
              >
                Export Excel
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* KPI */}
      <Grid container spacing={3}>
        {[
          {
            title: "Monthly Revenue",
            value:
              summary.monthlyRevenue,
          },
          {
            title: "Appointments",
            value:
              summary.monthlyAppointments,
          },
          {
            title: "Net Profit",
            value:
              summary.netProfit,
          },
          {
            title: "Tax Deduction",
            value:
              summary.taxDeduction,
          },
        ].map((item, index) => (
          <Grid
            size={{ xs: 12, md: 3 }}
            key={index}
          >
            <Card
              sx={{
                borderRadius: 5,
              }}
            >
              <CardContent>
                <Typography
                  color="text.secondary"
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: "#cf7d63",
                    mt: 1,
                  }}
                >
                  ₹{item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SERVICE */}
      <Box mt={5}>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Revenue By Service
        </Typography>

        {serviceRevenue.map(
          (item) => (
            <Card
              key={item._id}
              sx={{
                mb: 2,
                borderRadius: 4,
              }}
            >
              <CardContent>
                <Typography fontWeight="bold">
                  {item._id}
                </Typography>

                <Typography>
                  ₹{item.revenue}
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>

      {/* PAYMENT */}
      <Box mt={5}>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Payment Methods
        </Typography>

        {paymentMethods.map(
          (item) => (
            <Card
              key={item._id}
              sx={{
                mb: 2,
                borderRadius: 4,
              }}
            >
              <CardContent>
                <Typography fontWeight="bold">
                  {item._id}
                </Typography>

                <Typography>
                  ₹{item.amount}
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>

      {/* TARGETS */}
      <Box mt={5}>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Monthly Targets
        </Typography>

        {targets.map(
          (target) => (
            <Card
              key={target._id}
              sx={{
                mb: 3,
                borderRadius: 5,
              }}
            >
              <CardContent>
                <Typography fontWeight="bold">
                  {target.targetCategory}
                </Typography>

                <Typography>
                  Target:
                  ₹{target.targetAmount}
                </Typography>

                <Typography>
                  Actual:
                  ₹{target.actualAmount}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={
                    target.progress || 0
                  }
                  sx={{
                    mt: 2,
                    height: 10,
                    borderRadius: 10,
                  }}
                />

                <Typography mt={1}>
                  {target.progress || 0}%
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>
    </Box>
  );
}