import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // Expires in 10 minutes
   },
},{
    timestamps: true
});

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.models.Otp || mongoose.model("Otp", OtpSchema, "otps");

export default OtpModel;