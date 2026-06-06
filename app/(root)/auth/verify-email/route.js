import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/User.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return Response.json({ ok: false, message: "Invalid verification link" }, { status: 400 });
    }

    const user = await UserModel.findOne({
      email,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return Response.json({ ok: false, message: "Verification link is invalid or expired" }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return Response.json({ ok: true, message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json({ ok: false, message: "Failed to verify email" }, { status: 500 });
  }
}
