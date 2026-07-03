import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
} from "@mui/material";

import api from "../api/axios";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance");
      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log(err);
    }
  };

  /*
  =====================================
  MARK ATTENDANCE
  =====================================
  */

  const markAttendance = async (
    employeeId,
    status
  ) => {
    try {
      await api.post("/attendance", {
    employee: employeeId,
    status,
    date: new Date(),
});

      fetchAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  /*
  =====================================
  SEARCH
  =====================================
  */

  const filtered = attendance.filter((a) => {
    const name =
      `${a.employee?.firstName || ""} ${
        a.employee?.lastName || ""
      }`.toLowerCase();

    return name.includes(
      search.toLowerCase()
    );
  });

  /*
  =====================================
  COUNTS
  =====================================
  */

  const totalToday = attendance.filter(
    (a) =>
      new Date(a.createdAt).toDateString() ===
      new Date().toDateString()
  ).length;

  const presentCount =
    attendance.filter(
      (a) => a.status === "Present"
    ).length;

  const absentCount =
    attendance.filter(
      (a) => a.status === "Absent"
    ).length;

  const leaveCount =
    attendance.filter(
      (a) => a.status === "Leave"
    ).length;

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Attendance Management
      </Typography>

      {/* DASHBOARD */}

      <Grid container spacing={3} mb={3}>
      <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              background: "#bcbdbe",
            }}
          >
            <CardContent>
              <Typography>
                Today's Records
              </Typography>
              <Typography variant="h4">
                {totalToday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              background: "#c186e9",
              color: "white",
            }}
          >
            <CardContent>
              <Typography>
                Present
              </Typography>
              <Typography variant="h4">
                {presentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              background: "#ffb74d",
            }}
          >
            <CardContent>
              <Typography>
                Absent
              </Typography>
              <Typography variant="h4">
                {absentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

       <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              background: "#90caf9",
            }}
          >
            <CardContent>
              <Typography>
                Leave
              </Typography>
              <Typography variant="h4">
                {leaveCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MARK ATTENDANCE */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            mb={2}
          >
            Mark Attendance
          </Typography>

          <Grid container spacing={2}>
            {employees.map((emp) => (
              <Grid
                item
                xs={12}
                md={4}
                key={emp._id}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      fontWeight="bold"
                    >
                      {emp.firstName}{" "}
                      {emp.lastName}
                    </Typography>

                    <Typography
                      variant="body2"
                      mb={2}
                    >
                      {emp.staffRole}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          markAttendance(
                            emp._id,
                            "Present"
                          )
                        }
                      >
                        Present
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          markAttendance(
                            emp._id,
                            "Absent"
                          )
                        }
                      >
                        Absent
                      </Button>

                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() =>
                          markAttendance(
                            emp._id,
                            "Leave"
                          )
                        }
                      >
                        Leave
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* SEARCH */}

      <TextField
        fullWidth
        label="Search Employee"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{ mb: 3 }}
      />

      {/* TABLE */}

      <Paper>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background:
                  "#bcbdbe",
              }}
            >
              <TableCell>
                Employee
              </TableCell>

              <TableCell>
                Role
              </TableCell>

              <TableCell>
                Date
              </TableCell>

              <TableCell>
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a._id}>
                <TableCell>
                  {a.employee
                    ?.firstName}{" "}
                  {a.employee
                    ?.lastName}
                </TableCell>

                <TableCell>
                  {
                    a.employee
                      ?.staffRole
                  }
                </TableCell>

                <TableCell>
                  {new Date(
                    a.createdAt
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Chip
                    label={a.status}
                    color={
                      a.status ===
                      "Present"
                        ? "success"
                        : a.status ===
                          "Absent"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}