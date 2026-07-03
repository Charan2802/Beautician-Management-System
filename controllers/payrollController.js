import Payroll from "../models/Payroll.js";

// GET ALL PAYROLLS
export const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee")
      .sort({ createdAt: -1 });

    res.json({ payrolls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE PAYROLL
export const createPayroll = async (req, res) => {
  try {
    const payroll = new Payroll({
      employee: req.body.employee,
      month: req.body.month,
      year: req.body.year,
      baseSalary: Number(req.body.baseSalary || 0),
      commission: Number(req.body.commission || 0),
      bonus: Number(req.body.bonus || 0),
      status: "Pending",
    });

    await payroll.save();

    res.status(201).json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK AS PAID
export const markPayrollPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    payroll.status = "Paid";
    payroll.paidAt = new Date();

    await payroll.save();

    res.json({
      message: "Payroll marked as paid",
      payroll,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};