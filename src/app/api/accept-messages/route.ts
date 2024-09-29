import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    console.log("POST request received"); // Log when POST request is received
    await dbConnect();
    console.log("Database connected"); // Log database connection

    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Log the session object

    const user: User = session?.user as User;
    console.log("User:", user); // Log user info

    if (!session || !session.user) {
        console.log("Not authenticated"); // Log if not authenticated
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    console.log("User ID:", userId); // Log user ID

    const { acceptMessages } = await request.json();
    console.log("Accept Message:", acceptMessages); // Log the acceptMessage value

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        console.log("Updated User:", updatedUser); // Log updated user info

        if (!updatedUser) {
            console.log("Failed to update user status"); // Log failure to update
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                { status: 404 } // Changed to 404 to indicate user not found
            );
        }

        console.log("Message acceptance status updated successfully"); // Log success message
        return Response.json(
            {
                success: true,
                message: "message acceptance status updated",
                updatedUser
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating message acceptance status:", error); // Log the error
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    console.log("GET request received"); // Log when GET request is received
    await dbConnect();
    console.log("Database connected"); // Log database connection

    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Log the session object

    const user: User = session?.user as User;
    console.log("User:", user); // Log user info

    if (!session || !session.user) {
        console.log("Not authenticated"); // Log if not authenticated
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    console.log("User ID:", userId); // Log user ID

    try {
        const foundUser = await UserModel.findById(userId);
        console.log("Found User:", foundUser); // Log found user info

        if (!foundUser) {
            console.log("User not found"); // Log if user is not found
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                { status: 404 }
            );
        }

        console.log("Message acceptance status:", foundUser.isAcceptingMessages); // Log message acceptance status
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user message acceptance status:", error); // Log the error
        return Response.json(
            {
                success: false,
                message: "failed to get user message acceptance status"
            },
            { status: 500 }
        );
    }
}
