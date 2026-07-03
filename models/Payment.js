import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    
    invoiceNumber:{
        type:String,
        required:true,
        unique:true,
    },
    

    appointment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true,
    },

    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true,
    },

    totalBill:{
        type:Number,
        required:true,
    },

    amountPaid:{
        type:Number,
        required:true,
    },

    balanceDue:{
        type:Number,
        default:0,
    },

    paymentMethod:{
        type:String,
        enum:[
            "Cash",
            "UPI",
            "Card",
            "Bank"
        ],
        default:"Cash",
    },

    paymentDate:{
        type:Date,
        default:Date.now,
    },

    notes:{
        type:String,
        default:"",
    },
    totalBill: {
    type: Number,
    default: 0,
    },

    balanceDue: {
        type: Number,
        default: 0,
    },
},
{
    timestamps:true,
}
);

const Payment =
    mongoose.models.Payment ||
    mongoose.model(
        "Payment",
        paymentSchema
    );

export default Payment;