import { connectDB } from "@/lib/databaseConnection";
import { z } from "zod";
import bcrypt from "bcrypt";

const validatedSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function jsonResponse(status, message, data = null) {
  return Response.json({ ok: status < 400, message, data }, { status });
}

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();
    const validatedData = validatedSchema.safeParse(payload);

    if (!validatedData.success) {
      return jsonResponse(400, validatedData.error.errors[0].message);
    }

    const { name, email, password } = validatedData.data;

    const UserModel = (await import("@/models/User.model")).default;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return jsonResponse(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return jsonResponse(201, "User registered successfully", {
      id: newUser._id,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return jsonResponse(
      500,
      error instanceof Error ? error.message : "Internal Server Error"
    );
  }
}