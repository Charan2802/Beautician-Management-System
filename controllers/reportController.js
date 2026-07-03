import Payment from "../models/Payment.js";
import Appointment from "../models/appointment.js";
import Client from "../models/Client.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

/*
==================================
REPORT SUMMARY
==================================
*/

export const reportSummary = async (
  req,
  res
) => {
  try {
    const totalRevenue =
      await Payment.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amountPaid",
            },
          },
        },
      ]);

    const totalAppointments =
      await Appointment.countDocuments();

    const completedAppointments =
      await Appointment.countDocuments({
        status: "Completed",
      });

    const pendingAppointments =
      await Appointment.countDocuments({
        status: "Pending",
      });

    const totalClients =
      await Client.countDocuments();

    const totalEmployees =
      await Employee.countDocuments();

    const present =
      await Attendance.countDocuments({
        status: "Present",
      });

    const absent =
      await Attendance.countDocuments({
        status: "Absent",
      });

    const leave =
      await Attendance.countDocuments({
        status: "Leave",
      });

    res.json({
      success: true,

      revenue: {
        totalRevenue:
          totalRevenue[0]?.total || 0,
      },

      appointments: {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
      },

      clients: {
        totalClients,
      },

      employees: {
        totalEmployees,
      },

      attendance: {
        present,
        absent,
        leave,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==================================
SERVICE REVENUE
==================================
*/

export const serviceRevenue =
  async (req, res) => {
    try {
      const data =
        await Payment.aggregate([
          {
            $lookup: {
              from: "appointments",
              localField:
                "appointment",
              foreignField:
                "_id",
              as: "appointment",
            },
          },
          {
            $unwind:
              "$appointment",
          },
          {
            $group: {
              _id:
                "$appointment.service",
              revenue: {
                $sum:
                  "$amountPaid",
              },
            },
          },
          {
            $sort: {
              revenue: -1,
            },
          },
        ]);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/*
==================================
PAYMENT METHODS
==================================
*/

export const paymentMethods =
  async (req, res) => {
    try {
      const data =
        await Payment.aggregate([
          {
            $group: {
              _id:
                "$paymentMethod",
              amount: {
                $sum:
                  "$amountPaid",
              },
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };