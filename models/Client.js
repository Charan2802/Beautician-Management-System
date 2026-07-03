import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    totalVisits: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);