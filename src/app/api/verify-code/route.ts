import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not Found" },
        { status: 404 }
      );
    }

    const isValidCode = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isValidCode && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code is expired, please Signup again to get new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid Code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error verifying code`, error);
    return Response.json(
      { success: false, message: "Error verifying code" },
      { status: 500 }
    );
  }
}
