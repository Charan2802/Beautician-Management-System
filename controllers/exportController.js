import ExcelJS from "exceljs";
import Payment from "../models/Payment.js";
import Appointment from "../models/appointment.js";

const sendWorkbook = async (
  workbook,
  res,
  fileName
) => {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${fileName}`
  );

  await workbook.xlsx.write(res);

  res.end();
};

/*
=========================================
Monthly Revenue Export
GET /api/export/revenue
=========================================
*/
export const exportRevenue = async (
  req,
  res
) => {
  try {
    const payments = await Payment.find();

    const workbook = new ExcelJS.Workbook();

    const sheet =
      workbook.addWorksheet("Revenue");

    sheet.columns = [
      {
        header: "Invoice Number",
        key: "invoiceNumber",
        width: 20,
      },
      {
        header: "Amount Paid",
        key: "amountPaid",
        width: 15,
      },
      {
        header: "Payment Method",
        key: "paymentMethod",
        width: 20,
      },
      {
        header: "Payment Date",
        key: "paymentDate",
        width: 20,
      },
    ];

    payments.forEach((payment) => {
      sheet.addRow({
        invoiceNumber:
          payment.invoiceNumber,
        amountPaid: payment.amountPaid,
        paymentMethod:
          payment.paymentMethod,
        paymentDate:
          payment.paymentDate,
      });
    });

    await sendWorkbook(
      workbook,
      res,
      "MonthlyRevenue.xlsx"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=========================================
Payment Export
GET /api/export/payments
=========================================
*/
export const exportPayments = async (
  req,
  res
) => {
  try {
    const payments = await Payment.find()
      .populate("client");

    const workbook =
      new ExcelJS.Workbook();

    const sheet =
      workbook.addWorksheet("Payments");

    sheet.columns = [
      {
        header: "Invoice Number",
        key: "invoice",
        width: 20,
      },
      {
        header: "Client",
        key: "client",
        width: 25,
      },
      {
        header: "Amount Paid",
        key: "paid",
        width: 15,
      },
      {
        header: "Balance Due",
        key: "balance",
        width: 15,
      },
      {
        header: "Method",
        key: "method",
        width: 15,
      },
    ];

    payments.forEach((payment) => {
      sheet.addRow({
        invoice:
          payment.invoiceNumber,
        client:
          payment.client?.clientName,
        paid:
          payment.amountPaid,
        balance:
          payment.balanceDue,
        method:
          payment.paymentMethod,
      });
    });

    await sendWorkbook(
      workbook,
      res,
      "Payments.xlsx"
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=========================================
Appointment Export
GET /api/export/appointments
=========================================
*/
export const exportAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find()
          .populate("client")
          .populate("employee");

      const workbook =
        new ExcelJS.Workbook();

      const sheet =
        workbook.addWorksheet(
          "Appointments"
        );

      sheet.columns = [
        {
          header: "Booking Number",
          key: "booking",
          width: 20,
        },
        {
          header: "Client",
          key: "client",
          width: 25,
        },
        {
          header: "Employee",
          key: "employee",
          width: 25,
        },
        {
          header: "Service",
          key: "service",
          width: 25,
        },
        {
          header: "Amount",
          key: "amount",
          width: 15,
        },
      ];

      appointments.forEach(
        (appointment) => {
          sheet.addRow({
            booking:
              appointment.bookingNumber,
            client:
              appointment.client
                ?.clientName,
            employee: `${appointment.employee?.firstName} ${appointment.employee?.lastName}`,
            service:
              appointment.service,
            amount:
              appointment.totalAmount,
          });
        }
      );

      await sendWorkbook(
        workbook,
        res,
        "Appointments.xlsx"
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

/*
=========================================
Dashboard Report Export
GET /api/export/dashboard
=========================================
*/
export const exportDashboard =
  async (req, res) => {
    try {
      const payments =
        await Payment.find();

      const revenue =
        payments.reduce(
          (sum, p) =>
            sum + p.amountPaid,
          0
        );

      const workbook =
        new ExcelJS.Workbook();

      const sheet =
        workbook.addWorksheet(
          "Dashboard"
        );

      sheet.addRow([
        "Metric",
        "Value",
      ]);

      sheet.addRow([
        "Total Revenue",
        revenue,
      ]);

      sheet.addRow([
        "Total Payments",
        payments.length,
      ]);

      await sendWorkbook(
        workbook,
        res,
        "DashboardReport.xlsx"
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };