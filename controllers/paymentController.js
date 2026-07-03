import Payment from "../models/Payment.js";
import Appointment from "../models/appointment.js";
import PDFDocument from "pdfkit";

/*
=====================================
GENERATE INVOICE NUMBER
=====================================
*/
const generateInvoiceNumber = async () => {
  const count = await Payment.countDocuments();

  return `INV-${new Date().getFullYear()}-${String(
    count + 1
  ).padStart(5, "0")}`;
};

/*
=====================================
ADD PAYMENT
=====================================
*/
export const recordPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      amountPaid,
      paymentMethod,
      notes,
    } = req.body;

    const appointment =
      await Appointment.findById(appointmentId)
        .populate("client");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const currentPaid =
      appointment.advanceAmount || 0;

    const newTotal =
      currentPaid + Number(amountPaid);

    if (
      newTotal >
      Number(appointment.totalAmount)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment exceeds total amount",
      });
    }

    const invoiceNumber =
      await generateInvoiceNumber();

    const payment =
      await Payment.create({
        invoiceNumber,
        appointment: appointment._id,
        client: appointment.client._id,
        totalBill:
          appointment.totalAmount,
        amountPaid,
        balanceDue:
          appointment.totalAmount -
          newTotal,
        paymentMethod,
        notes,
      });

    /*
    UPDATE APPOINTMENT
    */

    appointment.advanceAmount =
      newTotal;

    appointment.remainingAmount =
      appointment.totalAmount -
      newTotal;

    if (
      newTotal >=
      appointment.totalAmount
    ) {
      appointment.paymentStatus =
        "Completed";

      appointment.remainingAmount = 0;
    } else if (newTotal > 0) {
      appointment.paymentStatus =
        "Advance";
    } else {
      appointment.paymentStatus =
        "Pending";
    }

    await appointment.save();

    res.status(201).json({
      success: true,
      message:
        "Payment recorded successfully",
      payment,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
GET ALL PAYMENTS
=====================================
*/
export const getPayments =
  async (req, res) => {
    try {
      const payments =
        await Payment.find()
          .populate(
            "client",
            "clientName phoneNumber"
          )
          .populate(
            "appointment"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=====================================
GET SINGLE PAYMENT
=====================================
*/
export const getPaymentById =
  async (req, res) => {
    try {
      const payment =
        await Payment.findById(
          req.params.id
        )
          .populate("client")
          .populate(
            "appointment"
          );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found",
        });
      }

      res.json({
        success: true,
        payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=====================================
UPDATE PAYMENT
=====================================
*/
export const updatePayment =
  async (req, res) => {
    try {
      const payment =
        await Payment.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found",
        });
      }

      res.json({
        success: true,
        message:
          "Payment updated",
        payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=====================================
DELETE PAYMENT
=====================================
*/
export const deletePayment =
  async (req, res) => {
    try {
      const payment =
        await Payment.findByIdAndDelete(
          req.params.id
        );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Payment not found",
        });
      }

      res.json({
        success: true,
        message:
          "Payment deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=====================================
MONTHLY REVENUE
=====================================
*/
export const monthlyRevenue =
  async (req, res) => {
    try {
      const revenue =
        await Payment.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum:
                  "$amountPaid",
              },
            },
          },
        ]);

      res.json({
        success: true,
        totalRevenue:
          revenue[0]
            ?.totalRevenue || 0,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=====================================
RECENT PAYMENTS
=====================================
*/
export const recentPayments =
  async (req, res) => {
    try {
      const payments =
        await Payment.find()
          .populate(
            "client",
            "clientName"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);

      res.json({
        success: true,
        payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=====================================
GENERATE PDF INVOICE
=====================================
*/
export const generateInvoicePdf =
  async (req, res) => {
    try {
      const payment =
        await Payment.findById(
          req.params.id
        )
          .populate("client")
          .populate(
            "appointment"
          );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message:
            "Invoice not found",
        });
      }

      const doc =
        new PDFDocument({
          margin: 50,
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${payment.invoiceNumber}.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(20)
        .text(
          "BEAUTICIAN INVOICE",
          {
            align:
              "center",
          }
        );

      doc.moveDown();

      doc.text(
        `Invoice Number: ${payment.invoiceNumber}`
      );

      doc.text(
        `Client: ${payment.client?.clientName}`
      );

      doc.text(
        `Payment Method: ${payment.paymentMethod}`
      );

      doc.text(
        `Amount Paid: ₹${payment.amountPaid}`
      );

      doc.text(
        `Balance Due: ₹${payment.balanceDue}`
      );

      doc.text(
        `Date: ${new Date(
          payment.createdAt
        ).toLocaleDateString()}`
      );

      doc.moveDown(2);

      doc.text(
        "Thank you for visiting Beautician Salon",
        {
          align:
            "center",
        }
      );

      doc.end();
    } catch (error) {
      if (
        !res.headersSent
      ) {
        res.status(500).json({
          success: false,
          message:
            error.message,
        });
      }
    }
  };