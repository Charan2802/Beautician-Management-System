import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";

import api from "../api/axios";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  const [recordOpen, setRecordOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [form, setForm] = useState({
    amountPaid: "",
    paymentMethod: "Cash",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  /*
  ======================
  FETCH
  ======================
  */

  const fetchPayments = async () => {
    try {
      const res =
        await api.get("/payments");

      setPayments(
        res.data.payments || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  /*
  ======================
  FORM CHANGE
  ======================
  */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /*
  ======================
  ADD PAYMENT
  ======================
  */

  const recordPayment =
    async () => {
      try {
        await api.post(
          "/payments",
          {
            appointmentId:
              selected
                ?.appointment
                ?._id,
            amountPaid:
              form.amountPaid,
            paymentMethod:
              form.paymentMethod,
          }
        );

        setRecordOpen(false);

        setForm({
          amountPaid: "",
          paymentMethod:
            "Cash",
        });

        fetchPayments();
      } catch (error) {
        console.log(error);
      }
    };

  /*
  ======================
  UPDATE
  ======================
  */

  const updatePayment =
    async () => {
      try {
        await api.put(
          `/payments/${selected._id}`,
          {
            amountPaid:
              selected.amountPaid,
            paymentMethod:
              selected.paymentMethod,
          }
        );

        setEditOpen(false);

        fetchPayments();
      } catch (error) {
        console.log(error);
      }
    };

  /*
  ======================
  DELETE
  ======================
  */

  const deletePayment =
    async (id) => {
      if (
        !window.confirm(
          "Delete payment?"
        )
      )
        return;

      try {
        await api.delete(
          `/payments/${id}`
        );

        fetchPayments();
      } catch (error) {
        console.log(error);
      }
    };

  /*
  ======================
  DOWNLOAD INVOICE
  ======================
  */

  const downloadInvoice =
    async (id) => {
      try {
        const response =
          await api.get(
            `/payments/invoice/${id}`,
            {
              responseType:
                "blob",
            }
          );

        const file =
          new Blob(
            [response.data],
            {
              type:
                "application/pdf",
            }
          );

        const url =
          window.URL.createObjectURL(
            file
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `invoice-${id}.pdf`;

        link.click();

      } catch (error) {
        console.log(error);
      }
    };

  /*
  ======================
  FILTER
  ======================
  */

  const filtered =
    payments.filter((p) =>
      p.invoiceNumber
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Payments &
        Invoices
      </Typography>

      <TextField
        fullWidth
        placeholder="Search Invoice..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        sx={{ mb: 3 }}
      />

      <Card
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent>

          {filtered.length ===
            0 && (
            <Typography>
              No payments
              found
            </Typography>
          )}

          {filtered.map(
            (payment) => (
              <Box
                key={
                  payment._id
                }
              >

                <Box
                  sx={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    py: 2,
                  }}
                >

                  {/* LEFT */}

                  <Box
                    sx={{
                      width:
                        "22%",
                    }}
                  >
                    <Typography
                      fontWeight="bold"
                    >
                      {
                        payment.invoiceNumber
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {
                        payment
                          .client
                          ?.clientName
                      }
                    </Typography>
                  </Box>

                  {/* AMOUNT */}

                  <Box>
                    ₹
                    {
                      payment.amountPaid
                    }
                  </Box>

                  {/* METHOD */}

                  <Box>
                    {
                      payment.paymentMethod
                    }
                  </Box>

                  {/* STATUS */}

                  <Chip
                    label={
                      payment.balanceDue ===
                      0
                        ? "Completed"
                        : "Advance"
                    }
                    color={
                      payment.balanceDue ===
                      0
                        ? "success"
                        : "warning"
                    }
                  />

                  {/* BUTTONS */}

                  <Stack
                    direction="row"
                    spacing={1}
                  >

                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        background:
                          "#c186e9",
                      }}
                      onClick={() => {
                        setSelected(
                          payment
                        );
                        setEditOpen(
                          true
                        );
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() =>
                        deletePayment(
                          payment._id
                        )
                      }
                    >
                      Delete
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        background:
                          "#cf7d63",
                      }}
                      onClick={() => {
                        setSelected(
                          payment
                        );

                        setRecordOpen(
                          true
                        );
                      }}
                    >
                      Add
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        downloadInvoice(
                          payment._id
                        )
                      }
                    >
                      Invoice
                    </Button>

                  </Stack>

                </Box>

                <Divider />

              </Box>
            )
          )}

        </CardContent>
      </Card>

      {/* ADD PAYMENT */}

      <Dialog
        open={recordOpen}
        onClose={() =>
          setRecordOpen(false)
        }
      >
        <DialogTitle>
          Add Payment
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            label="Amount"
            name="amountPaid"
            sx={{ mt: 2 }}
            value={
              form.amountPaid
            }
            onChange={
              handleChange
            }
          />

          <TextField
            fullWidth
            select
            sx={{ mt: 2 }}
            name="paymentMethod"
            value={
              form.paymentMethod
            }
            onChange={
              handleChange
            }
          >
            <MenuItem value="Cash">
              Cash
            </MenuItem>

            <MenuItem value="UPI">
              UPI
            </MenuItem>

            <MenuItem value="Card">
              Card
            </MenuItem>

          </TextField>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setRecordOpen(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              recordPayment
            }
          >
            Save
          </Button>

        </DialogActions>
      </Dialog>

      {/* EDIT */}

      <Dialog
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
      >
        <DialogTitle>
          Edit Payment
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            label="Amount"
            sx={{ mt: 2 }}
            value={
              selected
                ?.amountPaid ||
              ""
            }
            onChange={(e) =>
              setSelected({
                ...selected,
                amountPaid:
                  e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            select
            sx={{ mt: 2 }}
            value={
              selected
                ?.paymentMethod ||
              ""
            }
            onChange={(e) =>
              setSelected({
                ...selected,
                paymentMethod:
                  e.target.value,
              })
            }
          >
            <MenuItem value="Cash">
              Cash
            </MenuItem>

            <MenuItem value="UPI">
              UPI
            </MenuItem>

            <MenuItem value="Card">
              Card
            </MenuItem>

          </TextField>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setEditOpen(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              updatePayment
            }
          >
            Save
          </Button>

        </DialogActions>
      </Dialog>

    </Box>
  );
}