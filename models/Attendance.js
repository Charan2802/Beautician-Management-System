import mongoose from "mongoose";

const attendanceSchema =
  new mongoose.Schema(
    {
      employee: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Employee",
        required: true,
      },

      date: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Present",
          "Absent",
          "Leave",
        ],
        default: "Present",
      },

      remarks: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Attendance ||
  mongoose.model(
    "Attendance",
    attendanceSchema
  );