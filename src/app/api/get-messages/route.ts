import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(){
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user: User =session?.user as User

    if(!session||!session.user){
        console.log("problem in session")
        return Response.json({
            success:false,
            message:"not authenticated"
        },
        {
            status:401
        }
    )
    }
    console.log("user:",user)
    const userId=new mongoose.Types.ObjectId(user._id);
    console.log("usesr id:",userId)
    try {
        // const userdata=await UserModel.find({_id:userId})
        // console.log("userdata:",userdata);
        const userMessage=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        if(!userMessage||userMessage.length===0){
            console.log("user or messages not found")
            return Response.json({
                success:false,
                message:"Empty Message List"
                },
                {
                    status:401
                })
        }
        return Response.json({
            success:true,
            message:userMessage[0].messages
            },
            {
                status:200
            })

    } catch (error) {
        console.log ("unexpexted error occured",error)
        return Response.json({
            success:false,
            message:"error getting messages"
        },
        {
            status:500
        }
    )
    }
    
}