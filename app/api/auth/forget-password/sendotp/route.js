import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/databaseConnection";
import Usermodel from "@/models/Usermodel";
import { zSchema } from "@/lib/zodSchema";
import { forgotPasswordOtpEmail } from "@/email/forgetpassword";

export async function POST(request) {
  try {
    // Database Connection
    await connectDB();

    const payload = await request.json();

    // Validation
    const validationSchema = zSchema.pick({
      email: true,
    });

    const validateData = validationSchema.safeParse(payload);

    if (!validateData.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 }
      );
    }

    const { email } = validateData.data;

    // Find User
    const getUser = await Usermodel.findOne({
      email,
    });

    if (!getUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found with this email",
        },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save OTP
    getUser.otp = otp;
    getUser.otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await getUser.save();

    // Mail Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    // Fire-and-forget: send OTP email without blocking the response
    transporter.sendMail({
      from: `"DrChex" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: forgotPasswordOtpEmail(otp),
    }).then((info) => console.log("Mail Sent:", info.messageId))
      .catch((err) => console.error("Failed to send forgot-password OTP email:", err));

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}