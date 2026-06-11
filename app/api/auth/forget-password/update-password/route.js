import { connectDB } from "@/lib/databaseConnection";
import Usermodel from "@/models/Usermodel";
import { zSchema } from "@/lib/zodSchema";

export async function PUT(request) {
  try {
    await connectDb();

    const payload = await request.json();

    const validationSchema = zSchema.pick({
      email: true,
      password: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        400,
        "Invalid or missing fields",
        validatedData.error
      );
    }

    const { email, password } = validatedData.data;

    const getUser = await Usermodel.findOne({
      email,
      deletedAt: null,
    }).select("+password");

    if (!getUser) {
      return response(false, 404, "User not found");
    }

    getUser.password = password; // Hash if required

    await getUser.save();

    return response(
      true,
      200,
      "Password updated successfully!"
    );
  } catch (error) {
    return catcherror(error);
  }
}