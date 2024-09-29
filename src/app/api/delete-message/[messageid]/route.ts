import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    const messageId= params.messageid
    console.log("messageId to be deleted:",messageId)
    await dbConnect()
    const session=await getServerSession(authOptions)
    const user: User =session?.user as User

    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"not authenticated"
        },
        {
            status:401
        }
    )
    }
    try {
        console.log(messageId)
        const updateResult=await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        console.log(updateResult.modifiedCount)
        if(updateResult.modifiedCount){
            return Response.json({
                success:true,
                message:"message deleted successfully"
        },
        {
            status:200
        }
    )
        }
        
        return Response.json({
            success:true,
            message:"Message Deleted"
        },
        {
            status:200
        }
    )

    }catch(error){
        console.log("error in delete message route",error)
        return Response.json({
            success:false,
            message:"error deleting message"
        },
        {
            status:500
        }
    )
    }
    
}
