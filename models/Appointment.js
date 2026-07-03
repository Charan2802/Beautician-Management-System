import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    bookingNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    advanceAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Partial",
        "Completed",
      ],
      default: "Pending",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/*
====================================
AUTO CALCULATE PAYMENT STATUS
====================================
*/
appointmentSchema.pre("save", function () {

  this.remainingAmount =
    Number(this.totalAmount || 0) -
    Number(this.advanceAmount || 0);

  if (
    Number(this.advanceAmount) >=
    Number(this.totalAmount)
  ) {
    this.paymentStatus = "Completed";
  }
  else if (
    Number(this.advanceAmount) > 0
  ) {
    this.paymentStatus = "Partial";
  }
  else {
    this.paymentStatus = "Pending";
  }
});

/*
====================================
FIX OverwriteModelError
====================================
*/
const Appointment =
  mongoose.models.Appointment ||
  mongoose.model(
    "Appointment",
    appointmentSchema
  );

export default Appointment;