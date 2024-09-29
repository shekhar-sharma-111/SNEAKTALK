import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import{z} from 'zod'

const UsernameQuerySchema=z.object({
    username:usernameValidation
}
)

export async function GET(request:Request) {
    await dbConnect();
    try {
        const {searchParams}=new URL(request.url)
        // const username=searchParams.get('username')
        const queryParam={
            username:searchParams.get('username')
        }

        // zod 
        const query = UsernameQuerySchema.safeParse(queryParam);
        if(!query.success){
            const usernameErrors=query.error.format().username._errors||[]
            console.log(" status: false,message:error in checking thw username" )
            return Response.json({
                status: false,
                message:usernameErrors?.length>0
                ? usernameErrors.join(', ')
                :"invalid query parameters {username}"
            },
            {
                status: 400
            })
        }
        const {username}=query.data
        console.log(username);
        const existingVerifiedUsername = await UserModel.findOne({ username: username,isVerified:true});
        
        console.log(existingVerifiedUsername)
        if(existingVerifiedUsername){
            console.log(" status: false,\n message: username not available")
            return Response.json({
                status: false,
                message: "username not available"
            },
            {
                status: 400
            })   
        }
        return Response.json({
            status: true,
            message: "username available"
        },
        {
            status: 200
        })
    } catch (error) {
        console.log("error validating the username", error)
        return Response.json({
            status: false,
            message: "Error validating the username"
        },
        {
            status: 500
        })
    }
}