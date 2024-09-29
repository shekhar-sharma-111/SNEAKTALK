import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
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
        // user is accepting
        if (user.isAcceptingMessages===false) {
            return Response.json(
                {
                    success: false,
                    message: "user is not accepting messages",
                },
                {
                    status: 403,
                }
            );
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "message sent succcessfully",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log("error adding messages:", error);
        return Response.json(
            {
                success: false,
                message: "internal server error",
            },
            {
                status: 500,
            }
        );
    }
}
