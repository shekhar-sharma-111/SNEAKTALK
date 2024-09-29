import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from 'zod'

const VerifyQuerySchema = z.object({
    verifyCode: verifySchema
}
)

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json()
        VerifyQuerySchema.parse({verifyCode{ code }});
       
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername ||username  })
        // const user = await UserModel.findOne({ username: decodedUsername})
        if (!user) {
            return Response.json({
                success: false,
                message: "username not found"
            },
                {
                    status: 500
                }
            )
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = (user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "user account verified"
            },
                {
                    status: 200
                }
            )
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "OTP expired"
            },
                {
                    status: 400
                })
        }
        else {
           return Response.json({
                success: false,
                message: "incorrect OTP "
            },
                {
                    status: 400
                })
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            return Response.json({
                success: false,
                message: "invalid verification code code must be of 6 digit",
            }, {
                status: 400,
            });
        }
        console.log("error verifying user", error)
        return Response.json({
            status: false,
            message: "error verifying user"
        },
            {
                status: 500
            })
    }
}
