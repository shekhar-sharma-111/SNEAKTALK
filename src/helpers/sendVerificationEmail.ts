// import { resend } from "@/lib/resend"; 
import {Resend } from "resend";

import VerificationEmail from "../../emails/VerifcationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export const resend = new Resend("re_jjNNxaPD_AFXKHqTw73HjGZYb38i3oA9f")

export async function sendVerifcationEmail(

    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {


    try {
        console.log(email)
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email with verification code",
            react:VerificationEmail({username,otp:verifyCode})
        })
        
        return{success:true,message:"verification email send successfully"}
    } catch (error) {
        console.error("error sending verification email")
        return {
            success:false,message:"failed to send verification email"
        }
    }
    
}