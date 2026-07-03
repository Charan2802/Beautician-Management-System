import Leave from "../models/Leave.js";

export const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee")
      .sort({ createdAt: -1 });

    res.json({ leaves });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateLeaveStatus = async (
  req,
  res
) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(leave);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/**
 * MARK PAYROLL AS PAID
 */
export const markPayrollPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    payroll.status = "Paid";
    payroll.paidAt = new Date();

    await payroll.save();

    res.json({
      message: "Payroll marked as paid",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};