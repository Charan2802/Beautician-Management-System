import Appointment from "../models/appointment.js";
import Payment from "../models/Payment.js";
import Client from "../models/Client.js";
import Employee from "../models/Employee.js";
import MonthlyTarget from "../models/MonthlyTarget.js";

/*
=================================================
DASHBOARD SUMMARY
GET /api/dashboard
=================================================
*/
export const dashboardSummary = async (req, res) => {
  try {
    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const currentMonth =
      today.getMonth() + 1;

    const currentYear =
      today.getFullYear();

    /*
    =====================================
    COUNTS
    =====================================
    */

    const totalAppointments =
      await Appointment.countDocuments();

    const totalClients =
      await Client.countDocuments();

    const totalEmployees =
      await Employee.countDocuments();

    /*
    =====================================
    TODAY APPOINTMENTS
    =====================================
    */

    const todayAppointments =
      await Appointment.find({
        appointmentDate: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      })
        .populate("client")
        .populate("employee");

    /*
    =====================================
    TOTAL REVENUE
    =====================================
    */

    const revenue =
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

    const totalRevenue =
      revenue[0]?.total || 0;

    /*
    =====================================
    RECENT PAYMENTS
    =====================================
    */

    const recentPayments =
      await Payment.find()
        .populate(
          "client",
          "clientName"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    /*
    =====================================
    MONTHLY TARGET
    =====================================
    */

    const targets =
      await MonthlyTarget.find({
        month: currentMonth,
        year: currentYear,
      });

    const monthlyTarget =
      targets.reduce(
        (sum, item) =>
          sum + item.targetAmount,
        0
      );

    const monthlyActual =
      targets.reduce(
        (sum, item) =>
          sum + item.actualAmount,
        0
      );

    /*
    =====================================
    RESPONSE
    =====================================
    */

    res.json({
      success: true,

      totalRevenue,

      totalAppointments,

      totalClients,

      totalEmployees,

      todayAppointments,

      recentPayments,

      monthlyTarget,

      monthlyActual,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  
};
export const monthlyRevenueTrend = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const revenueByService = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentMethodAnalytics = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};