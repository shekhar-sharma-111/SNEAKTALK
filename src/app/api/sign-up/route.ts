import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerifcationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();

    // username verification
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exist",
        },
        {
          status: 400,
        }
      );
    }
    // existing email verification for user
    const existingUserByEmail = await UserModel.findOne({ email });

    // verify code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: "Email already exist and is verified",
            },
            {
                status:400
            }
        )
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);
            existingUserByEmail.password=hashedPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
            console.log(existingUserByEmail)
            await existingUserByEmail.save()
        }

    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      console.log(newUser)
      await newUser.save();
    }

    // send verification  email
    const emailResponse = await sendVerifcationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
  
      return Response.json(
        {
          success: false,
          message: "error registering user",
        },
        { status: 500 }
      );
    }
    return Response.json({
        success: true,
        message: "User created successfully,please verify email",
    },
    {
        status:201
    }
)
  } catch (error) {
    console.error("error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error creating user",
      },
      {
        status: 500,
      }
    );
  }
}


