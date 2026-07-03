import Appointment from "../models/appointment.js";
import Payment from "../models/Payment.js";
import generateInvoiceNumber from "../utils/generateInvoiceNumber.js";

/*
==========================================
CREATE APPOINTMENT
==========================================
*/
export const createAppointment = async (req, res) => {
  try {
    const {
      client,
      employee,
      service,
      appointmentDate,
      appointmentTime,
      totalAmount,
      advanceAmount = 0,
      paymentMethod = "Cash",
      notes,
    } = req.body;

    let paymentStatus = "Pending";

    if (Number(advanceAmount) >= Number(totalAmount)) {
      paymentStatus = "Completed";
    } else if (Number(advanceAmount) > 0) {
      paymentStatus = "Advance";
    }

    const bookingNumber = `BK-${Date.now()}`;

    const appointment = await Appointment.create({
      client,
      employee,
      service,
      appointmentDate,
      appointmentTime,
      totalAmount,
      advanceAmount,
      remainingAmount:
        Number(totalAmount) -
        Number(advanceAmount),
      bookingNumber,
      paymentStatus,
      status: "Pending",
      notes,
    });

    /*
    =====================================
    AUTO PAYMENT + AUTO INVOICE
    =====================================
    */
    if (Number(advanceAmount) > 0) {
      const invoiceNumber =
        await generateInvoiceNumber();

      await Payment.create({
        invoiceNumber,
        appointment: appointment._id,
        client,
        totalBill: totalAmount,
        amountPaid: advanceAmount,
        balanceDue:
          Number(totalAmount) -
          Number(advanceAmount),
        paymentMethod,
        notes:
          "Auto generated during booking",
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Appointment created successfully",
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
==========================================
GET ALL APPOINTMENTS
==========================================
*/
export const getAppointments = async (
  req,
  res
) => {
  try {
    const appointments =
      await Appointment.find()
        .populate("client")
        .populate("employee")
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
GET SINGLE APPOINTMENT
==========================================
*/
export const getAppointmentById =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findById(
          req.params.id
        )
          .populate("client")
          .populate("employee");

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found",
        });
      }

      res.json({
        success: true,
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
==========================================
UPDATE APPOINTMENT
==========================================
*/
export const updateAppointment =
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      const total =
        Number(
          updateData.totalAmount || 0
        );

      const advance =
        Number(
          updateData.advanceAmount || 0
        );

      if (
        updateData.totalAmount !==
          undefined ||
        updateData.advanceAmount !==
          undefined
      ) {
        if (advance >= total) {
          updateData.paymentStatus =
            "Completed";
        } else if (advance > 0) {
          updateData.paymentStatus =
            "Advance";
        } else {
          updateData.paymentStatus =
            "Pending";
        }

        updateData.remainingAmount =
          total - advance;
      }

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );

      res.json({
        success: true,
        message:
          "Appointment updated",
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
==========================================
UPDATE STATUS
==========================================
*/
export const updateStatus =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
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
==========================================
DELETE APPOINTMENT
==========================================
*/
export const deleteAppointment =
  async (req, res) => {
    try {
      await Appointment.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Appointment deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };