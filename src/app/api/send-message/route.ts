import connectDB from "@/lib/dbConnect";
import UserModel, { User } from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request:Request) {
    await connectDB();

    const {username,content} = await request.json()

    const user = await UserModel.findOne({username})
    try {

        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "user not found",
                },
                {
                  status: 404,
                }
              );
        }

        // Check is User accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "User not accepting messages",
                },
                {
                  status: 403,
                }
              );
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json(
            {
              success: true,
              message: "Message sent Successfully",
            },
            {
              status: 200,
            }
          );

    } catch (error) {
        console.log("send-message ",error)
        return Response.json(
            {
              success: false,
              message: "Fail to send messages",
            },
            {
              status: 401,
            }
          );
    }
}