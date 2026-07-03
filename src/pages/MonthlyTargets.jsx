import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import api from "../api/axios";

export default function MonthlyTargets() {
  const [targets, setTargets] = useState([]);

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    targetCategory: "",
    targetAmount: "",
    actualAmount: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const res = await api.get("/monthly-targets");

      setTargets(res.data.targets || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (target = null) => {
    if (target) {
      setEditingId(target._id);

      setForm({
        targetCategory: target.targetCategory,
        targetAmount: target.targetAmount,
        actualAmount: target.actualAmount,
        month: target.month,
        year: target.year,
      });
    } else {
      setEditingId(null);

      setForm({
        targetCategory: "",
        targetAmount: "",
        actualAmount: 0,
        month,
        year,
      });
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveTarget = async () => {
    try {
      if (editingId) {
        await api.put(
          `/monthly-targets/${editingId}`,
          form
        );
      } else {
        await api.post(
          "/monthly-targets",
          form
        );
      }

      fetchTargets();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTarget = async (id) => {
    if (!window.confirm("Delete target?"))
      return;

    try {
      await api.delete(
        `/monthly-targets/${id}`
      );

      fetchTargets();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTargets = targets.filter(
    (target) =>
      Number(target.month) === Number(month) &&
      Number(target.year) === Number(year)
  );

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Monthly Targets
      </Typography>

      <Grid container spacing={2} mb={3}>
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
            sx={{
                  height: "56px",
                  borderRadius: 3,
                  color:"white",
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
            onClick={() => handleOpen()}
          >
            Add Target
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredTargets.map((target) => {
          const progress =
            target.targetAmount > 0
              ? Math.min(
                  (target.actualAmount /
                    target.targetAmount) *
                    100,
                  100
                )
              : 0;

          return (
            <Grid
              size={{ xs: 12, md: 4 }}
              key={target._id}
            >
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {target.targetCategory}
                    </Typography>

                    <Box>
                      <IconButton
                        onClick={() =>
                          handleOpen(target)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          deleteTarget(
                            target._id
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography mt={2}>
                    Target:
                    ₹{target.targetAmount}
                  </Typography>

                  <Typography>
                    Actual:
                    ₹{target.actualAmount}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      mt: 2,
                      height: 10,
                      borderRadius: 5,
                    }}
                  />

                  <Typography mt={1}>
                    {progress.toFixed(0)}%
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          {editingId
            ? "Edit Target"
            : "Add Target"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Category"
            name="targetCategory"
            value={form.targetCategory}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Target Amount"
            name="targetAmount"
            type="number"
            value={form.targetAmount}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Actual Amount"
            name="actualAmount"
            type="number"
            value={form.actualAmount}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Month"
            name="month"
            type="number"
            value={form.month}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}
          sx={{
                  height: "30px",
                  borderRadius: 3,
                  color:"white",
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={saveTarget}
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}