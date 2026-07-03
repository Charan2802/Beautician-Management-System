import { useEffect, useState } from "react";
import {
  Edit,
  Delete,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

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

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
  client: "",
  employee: "",
  service: "",
  appointmentDate: "",
  appointmentTime: "",
  totalAmount: "",
  advanceAmount: "",
  notes: "",
});

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchEmployees();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data.clients || []);
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

  const createAppointment = async () => {
    try {
      await api.post("/appointments", {
    client: form.client,
    employee: form.employee,
    service: form.service,
    appointmentDate: form.appointmentDate,
    appointmentTime: form.appointmentTime,
    totalAmount: Number(form.totalAmount),
    advanceAmount: Number(form.advanceAmount),
    notes: form.notes,
});

      setOpen(false);

      setForm({
        client: "",
        employee: "",
        service: "",
        appointmentDate: "",
        appointmentTime: "",
        totalAmount: "",
        advanceAmount: "",
        notes: "",
      });

      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to create appointment"
      );
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete appointment?")) return;

    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const editAppointment = (appointment) => {
  setEditing(appointment);

  setForm({
    client: appointment.client?._id,
    employee: appointment.employee?._id,
    service: appointment.service,
    appointmentDate:
      appointment.appointmentDate?.split("T")[0],
    appointmentTime:
      appointment.appointmentTime,
    totalAmount:
      appointment.totalAmount,
    advanceAmount:
      appointment.advanceAmount,
    notes:
      appointment.notes || "",
  });

  setOpen(true);
};

  const filtered = appointments.filter((a) =>
    a.service
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Box>
       <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          color: "#cf7d63",
          mb: 3,
        }}
      >
       Appointments
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search service..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
                  height: "56px",
                  borderRadius: 3,
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
        >
          New Appointment
        </Button>
      </Box>

      <Card>
        <CardContent>
          {filtered.map((item) => (
            <Box
              key={item._id}
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                borderBottom:
                  "1px solid #eee",
                py: 2,
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {item.bookingNumber}
                </Typography>

                <Typography>
                  {item.client?.clientName}
                </Typography>

                <Typography>
                  {item.service}
                </Typography>
              </Box>

              <Box>
                <Typography>
                  ₹{item.totalAmount}
                </Typography>
              </Box>

              <Chip
                label={item.paymentStatus}
                color={
                  item.paymentStatus ===
                  "Completed"
                    ? "success"
                    : item.paymentStatus ===
                      "Advance"
                    ? "warning"
                    : "error"
                }
              />

              <Chip
                label={item.bookingStatus}
                color="primary"
              />  

              <Button
                color="error"
                onClick={() =>
                  deleteAppointment(item._id)
                }
                sx={{
                  height: "30px",
                  borderRadius: 3,
                  color:"white",
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        
      >
        <DialogTitle>
          Create Appointment
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid size={6}>
              <TextField
                select
                fullWidth
                label="Client"
                name="client"
                value={form.client}
                onChange={handleChange}
              >
                {clients.map((c) => (
                  <MenuItem
                    key={c._id}
                    value={c._id}
                  >
                    {c.clientName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField
                select
                fullWidth
                label="Employee"
                name="employee"
                value={form.employee}
                onChange={handleChange}
              >
                {employees.map((e) => (
                  <MenuItem
                    key={e._id}
                    value={e._id}
                  >
                    {e.firstName}{" "}
                    {e.lastName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Service"
                name="service"
                value={form.service}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={6}>
              <TextField
              type="date"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Grid>

            <Grid size={6}>
             <TextField
              
                type="time"
                name="appointmentTime"
                value={form.appointmentTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
            />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Total Amount"
                name="totalAmount"
                type="number"
                value={form.totalAmount}
                onChange={handleChange}
            />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Advance Amount"
                name="advanceAmount"
                value={form.advanceAmount}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}sx={{
                  height: "30px",
                  borderRadius: 3,
                  color: "white",
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={createAppointment}
            sx={{
                  height: "30px",
                  borderRadius: 3,
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Appointments;