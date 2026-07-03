import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Grid,
} from "@mui/material";

import api from "../api/axios";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    employee: "",
    leaveType: "Sick",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createLeave = async () => {
    try {
      await api.post("/leaves", form);

      setOpen(false);

      setForm({
        employee: "",
        leaveType: "Sick",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, {
        status,
      });

      fetchLeaves();
    } catch (error) {
      console.log(error);
    }
  };

  const getChipColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";

      case "Rejected":
        return "error";

      default:
        return "warning";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const employeeName = `${leave.employee?.firstName || ""} ${
      leave.employee?.lastName || ""
    }`;

    return (
      employeeName.toLowerCase().includes(search.toLowerCase()) &&
      (employeeFilter === "" ||
        leave.employee?._id === employeeFilter) &&
      (dateFilter === "" ||
        leave.fromDate?.slice(0, 10) === dateFilter)
    );
  });

  const approvedCount = leaves.filter(
    (l) => l.status === "Approved"
  ).length;

  const rejectedCount = leaves.filter(
    (l) => l.status === "Rejected"
  ).length;

  const pendingCount = leaves.filter(
    (l) => !l.status || l.status === "Pending"
  ).length;

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ color: "#cf7d63",}}
      >
        Leave Management
      </Typography>

      {/* Dashboard Cards */}

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Pending Requests</Typography>
              <Typography variant="h4">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Approved Leaves</Typography>
              <Typography variant="h4">
                {approvedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography>Rejected Leaves</Typography>
              <Typography variant="h4">
                {rejectedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search Employee"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Employee"
                value={employeeFilter}
                onChange={(e) =>
                  setEmployeeFilter(e.target.value)
                }
              >
                <MenuItem value="">
                  All Employees
                </MenuItem>

                {employees.map((emp) => (
                  <MenuItem
                    key={emp._id}
                    value={emp._id}
                  >
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(e.target.value)
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  height: "56px",
                 background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
                onClick={() => setOpen(true)}
              >
                Request
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leave Records */}

      {filteredLeaves.map((leave) => (
        <Card key={leave._id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid
  container
  spacing={2}
  sx={{
    alignItems: "center",
  }}
>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography fontWeight="bold">
                  {leave.employee?.firstName}{" "}
                  {leave.employee?.lastName}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Typography>
                  {leave.leaveType}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Typography>
                  {leave.fromDate?.slice(0, 10)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Typography>
                  {leave.toDate?.slice(0, 10)}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 1 }}>
                <Chip
                  label={leave.status || "Pending"}
                  color={getChipColor(leave.status)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  color="success"
                  size="small"
                  onClick={() =>
                    updateStatus(
                      leave._id,
                      "Approved"
                    )
                  }
                >
                  Approve
                </Button>

                <Button
                  color="error"
                  size="small"
                  onClick={() =>
                    updateStatus(
                      leave._id,
                      "Rejected"
                    )
                  }
                >
                  Reject
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {/* Request Leave Modal */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        
      >
        <DialogTitle>
          New Leave Request
        </DialogTitle>

        <DialogContent>
          <TextField
            select
            fullWidth
            label="Employee"
            name="employee"
            value={form.employee}
            onChange={handleChange}
            sx={{ mt: 2 }}
          >
            {employees.map((emp) => (
              <MenuItem
                key={emp._id}
                value={emp._id}
              >
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Leave Type"
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Sick">
              Sick
            </MenuItem>
            <MenuItem value="Casual">
              Casual
            </MenuItem>
            <MenuItem value="Emergency">
              Emergency
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="date"
            name="fromDate"
            value={form.fromDate}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            type="date"
            name="toDate"
            value={form.toDate}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={createLeave}
            sx={{
              backgroundColor: "#c186e9",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}