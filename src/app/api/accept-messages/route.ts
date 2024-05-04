import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Fail to update user status to acceptMessages",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance changed",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Fail to update user status to acceptMessages");
    return Response.json(
      {
        success: false,
        message: "Fail to update user status to acceptMessages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Fail to fetch user ");
    return Response.json(
      {
        success: false,
        message: "Fail to fetch user acceptance status",
      },
      { status: 500 }
    );
  }
}
