import{z} from "zod"

export const messageSchema
=z.object({
        content:z.string()
        .min(12,{message:"min length of the messages must be at least 10 characters"})
        .max(300,{message:"constent must not exceed 300 chars"})
})