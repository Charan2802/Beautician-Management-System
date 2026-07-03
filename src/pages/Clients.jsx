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
} from "@mui/material";

import {
  Edit,
  Delete,
  PersonAdd,
} from "@mui/icons-material";

import api from "../api/axios";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    clientName: "",
    phoneNumber: "",
    email: "",
    gender: "Female",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data.clients || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = (client = null) => {
    setEditing(client);

    if (client) {
      setForm({
        clientName: client.clientName,
        phoneNumber: client.phoneNumber,
        email: client.email,
        gender: client.gender,
      });
    } else {
      setForm({
        clientName: "",
        phoneNumber: "",
        email: "",
        gender: "Female",
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

const saveClient = async () => {
  try {
    console.log("Sending:", form);

    let response;

    if (editing) {
      response = await api.put(
        `/clients/${editing._id}`,
        form
      );
    } else {
      response = await api.post(
        "/clients",
        form
      );
    }

    console.log("SUCCESS:", response.data);

    fetchClients();
    handleClose();

  } catch (err) {
    console.log(
      "FULL ERROR:",
      err.response?.data
    );

    alert(
      JSON.stringify(
        err.response?.data,
        null,
        2
      )
    );
  }
};


  const deleteClient = async (id) => {
    if (
      !window.confirm(
        "Delete this client?"
      )
    )
      return;

    try {
      await api.delete(
        `/clients/${id}`
      );

      fetchClients();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered =
    clients.filter((c) =>
      c.clientName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
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
          Client Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() =>
            handleOpen()
          }
          sx={{
                  height: "36px",
                  borderRadius: 3,
                  fontWeight:
                    "bold",
                  background:
                    "linear-gradient(135deg,#cf7d63,#c186e9)",
                }}
        >
          Add Client
        </Button>
      </Box>

      {/* STATS */}

      <Grid
        container
        spacing={3}
        mb={3}
      >
        <Grid size={{ xs:12, md:4 }}>
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography>
                Total Clients
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {clients.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs:12, md:4 }}>
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography>
                Female Clients
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {
                  clients.filter(
                    (c) =>
                      c.gender ===
                      "Female"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs:12, md:4 }}>
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography>
                Male Clients
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {
                  clients.filter(
                    (c) =>
                      c.gender ===
                      "Male"
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
        placeholder="Search Client..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        sx={{ mb: 3 }}
      />

      {/* CLIENT CARDS */}

      <Grid
        container
        spacing={3}
      >
        {filtered.map(
          (client) => (
            <Grid
              key={client._id}
              size={{
                xs:12,
                md:4,
              }}
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
    alignItems: "center"
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
                      {client.clientName?.charAt(
                        0
                      )}
                    </Avatar>

                    <Box>
                      <Typography
                        fontWeight="bold"
                      >
                        {
                          client.clientName
                        }
                      </Typography>

                      <Chip
                        label={
                          client.gender
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            "#bcbdbe",
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography>
                    📞{" "}
                    {
                      client.phoneNumber
                    }
                  </Typography>

                  <Typography>
                    ✉️{" "}
                    {
                      client.email
                    }
                  </Typography>

                  <Box mt={2}>
                    <IconButton
                      onClick={() =>
                        handleOpen(
                          client
                        )
                      }
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        deleteClient(
                          client._id
                        )
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {/* MODAL */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          {editing
            ? "Edit Client"
            : "Add Client"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="clientName"
            value={
              form.clientName
            }
            onChange={
              handleChange
            }
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phoneNumber"
            value={
              form.phoneNumber
            }
            onChange={
              handleChange
            }
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Gender"
            name="gender"
            value={
              form.gender
            }
            onChange={
              handleChange
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleClose
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              saveClient
            }
            sx={{
              bgcolor:
                "#c186e9",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}