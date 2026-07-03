import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  Switch,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
} from "@mui/icons-material";

import api from "../api/axios";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    staffRole: "Beautician",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = (employee = null) => {
    setEditing(employee);

    if (employee) {
      setForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        staffRole: employee.staffRole,
        phoneNumber: employee.phoneNumber,
        email: employee.email,
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        staffRole: "Beautician",
        phoneNumber: "",
        email: "",
      });
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const saveEmployee = async () => {
    try {
      if (editing) {
        await api.put(
          `/employees/${editing._id}`,
          form
        );
      } else {
        await api.post(
          "/employees",
          form
        );
      }

      fetchEmployees();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete employee?"))
      return;

    try {
      await api.delete(
        `/employees/${id}`
      );

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(
        `/employees/toggle-status/${id}`
      );

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = employees.filter(
    (emp) =>
      emp.firstName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      emp.lastName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      emp.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      {/* HEADER */}

      <Box
        sx={{ display:"flex", justifyContent:"space-between" }}
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Employee Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
                  height: "36px",
                  borderRadius: 3,
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
          onClick={() => handleOpen()}
        >
          Add Employee
        </Button>
      </Box>

      {/* STATS */}

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography>
                Total Employees
              </Typography>
              <Typography variant="h4">
                {employees.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography>
                Active
              </Typography>
              <Typography variant="h4">
                {
                  employees.filter(
                    (e) =>
                      e.accountStatus ===
                      "Active"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography>
                Inactive
              </Typography>
              <Typography variant="h4">
                {
                  employees.filter(
                    (e) =>
                      e.accountStatus ===
                      "Inactive"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SEARCH */}

      <TextField
        fullWidth
        placeholder="Search employee..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{ mb: 3 }}
      />

      {/* EMPLOYEE CARDS */}

      <Grid container spacing={3}>
        {filtered.map((emp) => (
          <Grid
            key={emp._id}
            size={{ xs: 12, md: 4 }}
          >
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: 4,
              }}
            >
              <CardContent>
                <Box
                sx={{
    display: "flex",
    justifyContent: "space-between",
  }}
                  mb={2}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        "#c186e9",
                      mr: 2,
                    }}
                  >
                    {emp.firstName?.charAt(
                      0
                    )}
                  </Avatar>

                  <Box>
                    <Typography
                      fontWeight="bold"
                    >
                      {emp.firstName}{" "}
                      {emp.lastName}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {emp.staffRole}
                    </Typography>
                  </Box>
                </Box>

                <Typography>
                  📞 {emp.phoneNumber}
                </Typography>

                <Typography>
                  ✉️ {emp.email}
                </Typography>

                <Box mt={2}>
                  <Chip
                    label={
                      emp.accountStatus
                    }
                    color={
                      emp.accountStatus ===
                      "Active"
                        ? "success"
                        : "error"
                    }
                  />
                </Box>

                <Box
                  mt={2}
sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}                >
                  <Switch
                    checked={
                      emp.accountStatus ===
                      "Active"
                    }
                    onChange={() =>
                      toggleStatus(
                        emp._id
                      )
                    }
                  />

                  <Box>
                    <IconButton
                      onClick={() =>
                        handleOpen(
                          emp
                        )
                      }
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        deleteEmployee(
                          emp._id
                        )
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MODAL */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          {editing
            ? "Edit Employee"
            : "Add Employee"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Role"
            name="staffRole"
            value={form.staffRole}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#c186e9",
            }}
            onClick={saveEmployee}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}