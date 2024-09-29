import {z} from "zod"

export const usernameValidation=z.string().min(2,"username must be more than 2 chars long")
.max(20,"username must be lesser than 20 chars")
.regex(/^[a-zA-Z0-9_]+$/,"user name must contain special characters")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email"}),
    password:z.string().min(8,{message:"password must be more than 8 chars long"}),
})