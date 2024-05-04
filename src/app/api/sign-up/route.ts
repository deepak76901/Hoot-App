import connectDB from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user.model";
import { randomInt } from "crypto";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = randomInt(100000, 999999).toString();
    const expiryIn = new Date();
    expiryIn.setHours(expiryIn.getHours() + 1);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exist, with this email",
        });
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryIn;
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryIn,
        isVeified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send Verification Email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username registered Successfully. Please verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error during registering Email", error);
    return Response.json(
      {
        success: false,
        message: "Error during registering Email",
      },
      {
        status: 500,
      }
    );
  }
}
