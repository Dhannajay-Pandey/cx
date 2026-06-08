import { connectDB } from "@/lib/databaseConnection";
import OtpModel from "@/models/Otp.model";

function jsonResponse(status, message, data = null) {
  return Response.json({ ok: status < 400, message, data }, { status });
}

export async function POST(request) {
  try {
    await connectDB();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return jsonResponse(400, "Email and OTP are required");
    }

    const record = await OtpModel.findOne({ email, otp }).sort({ createdAt: -1 });

    if (!record) {
      return jsonResponse(400, "Invalid or expired OTP");
    }

    await OtpModel.deleteMany({ email });

    return jsonResponse(200, "OTP verified successfully", { email });
  } catch (error) {
    console.error("OTP verification error:", error);
    return jsonResponse(500, error instanceof Error ? error.message : "Internal Server Error");
  }
}
