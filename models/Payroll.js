import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: Number,
    year: Number,

    baseSalary: {
      type: Number,
      default: 0,
    },

    commission: {
      type: Number,
      default: 0,
    },

    bonus: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);