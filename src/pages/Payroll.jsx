import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import api from "../api/axios";

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    employee: "",
    month: "",
    year: "",
    baseSalary: "",
    commission: "",
    bonus: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchPayrolls();
  }, []);

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data.employees || []);
  };

  const fetchPayrolls = async () => {
    const res = await api.get("/payroll");
    setPayrolls(res.data.payrolls || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE PAYROLL
  const createPayroll = async () => {
    await api.post("/payroll", form);

    setOpen(false);
    setForm({
      employee: "",
      month: "",
      year: "",
      baseSalary: "",
      commission: "",
      bonus: "",
    });

    fetchPayrolls();
  };

  // MARK AS PAID (FIXED ROUTE)
  const markPaid = async (id) => {
    await api.put(`/payroll/pay/${id}`);
    fetchPayrolls();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Payroll</Typography>

        <Button variant="contained" sx={{
                  height: "36px",
                  borderRadius: 3,
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}onClick={() => setOpen(true)}>
          Generate Payroll
        </Button>
      </Box>

      <Grid container spacing={2}>
        {payrolls.map((p) => (
          <Grid item xs={12} md={4} key={p._id}>
            <Card>
              <CardContent>
                <Typography>
                  {p.employee?.firstName} {p.employee?.lastName}
                </Typography>

                <Typography>
                  {p.month}/{p.year}
                </Typography>

                <Typography>Total: ₹{p.baseSalary + p.commission + p.bonus}</Typography>

                <Chip
                  label={p.status || "Pending"}
                  color={p.status === "Paid" ? "success" : "warning"}
                />

                {p.status !== "Paid" && (
                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => markPaid(p._id)}
                  >
                    Mark as Paid
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Create Payroll</DialogTitle>

        <DialogContent>
          <TextField
            select
            fullWidth
            name="employee"
            value={form.employee}
            onChange={handleChange}
            sx={{ mt: 2 }}
          >
            {employees.map((e) => (
              <MenuItem key={e._id} value={e._id}>
                {e.firstName} {e.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField fullWidth name="month" label="Month" onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth name="year" label="Year" onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth name="baseSalary" label="Base Salary" onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth name="commission" label="Commission" onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth name="bonus" label="Bonus" onChange={handleChange} sx={{ mt: 2 }} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={createPayroll}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}