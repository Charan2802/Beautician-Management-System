import mongoose from "mongoose";

const monthlyTargetSchema =
  new mongoose.Schema(
    {
      targetCategory: {
        type: String,
        required: true,
      },

      targetAmount: {
        type: Number,
        required: true,
      },

      actualAmount: {
        type: Number,
        default: 0,
      },

      month: {
        type: Number,
        required: true,
      },

      year: {
        type: Number,
        required: true,
      },

      progress: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "MonthlyTarget",
  monthlyTargetSchema
);