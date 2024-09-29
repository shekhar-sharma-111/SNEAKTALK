// "use client";
// import { Button } from "@/components/ui/button";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { AxiosError } from "axios";
// import { Loader2 } from "lucide-react";
// import Link from "next/link";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { Form } from "@/components/ui/form";
// import z from "zod";
// import { messageSchema } from "@/schemas/messageSchema";
// import messages from "@/data/messages.json"

// function PublicUser({ params }: { params: { username: string } }) {
//     const username = params?.username;
//     const { toast } = useToast();
//     const form = useForm<z.infer<typeof messageSchema>>({
//         resolver: zodResolver(messageSchema),
//     });

//     const onSubmit = async (data: z.infer<typeof messageSchema>) => {
//         try {
//             const response = await axios.post(`/api/send-messages`, {
//                 username: username,
//                 content: data.content
//             });
//             toast({
//                 title: "Success",
//                 description: response.data.message,
//             });
//         } catch (error) {
//             const axiosError = error as AxiosError<ApiResponse>;
//             const errorMsg = axiosError.response?.data.message ?? "Error sending messages";
//             toast({
//                 title: "Sorry",
//                 description: errorMsg,
//                 variant: "destructive",
//             });
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//             <h1 className="text-3xl font-bold mb-4 text-center">Send a Message</h1>
            
//             <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
//                 <h2 className="text-xl font-semibold mb-4">Send a Message to {username || "an anonymous user"}</h2>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                         <FormField
//                             control={form.control}
//                             name="content"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-700">Message Content</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//                                             placeholder={`Ask ${username || "an anonymous user"} anything`}
//                                             {...field}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button
//                             type="submit"
//                             className="w-full bg-black text-white rounded-lg p-3 hover:bg-blue-700 transition"
//                         >
//                             {false ? (
//                                 <>
//                                     <Loader2 className="animate-spin mr-2" />
//                                     Please wait...
//                                 </>
//                             ) : (
//                                 "Send Message"
//                             )}
//                         </Button>
//                     </form>
//                 </Form>
//             </div>
            
//             <div className="mt-6 text-center">
//                 <p>
//                     Want to use Anonymous messages?{" "}
//                     <Link href="/sign-in" className="text-blue-500 hover:underline">
//                         <Button  className="w-full bg-black text-white rounded-lg p-3 hover:bg-blue-700 transition"
//                         >See Yours</Button>
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default PublicUser;

"use client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import z from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import messages from "@/data/messages.json";

function PublicUser({ params }: { params: { username: string } }) {
    const username = params?.username;
    const { toast } = useToast();
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const [suggestions, setSuggestions] = useState<string[]>([]);

    const getRandomMessages = () => {
        const shuffled = messages.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5).map(message => message.content);
    };

    useEffect(() => {
        setSuggestions(getRandomMessages());
    }, []);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            const response = await axios.post(`/api/send-messages`, {
                username: username,
                content: data.content,
            });
            toast({
                title: "Success",
                description: response.data.message,
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMsg = axiosError.response?.data.message ?? "Error sending messages";
            toast({
                title: "Sorry",
                description: errorMsg,
                variant: "destructive",
            });
        }
    };

    const handleSuggestionClick = (message: string) => {
        form.setValue("content", message);
    };

    const handleNewSuggestions = () => {
        setSuggestions(getRandomMessages());
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Send a Message</h1>
            
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Send a Message to {username || "an anonymous user"}</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Message Content</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            placeholder={`Ask ${username || "an anonymous user"} anything`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-black text-white rounded-lg p-3 hover:bg-blue-700 transition"
                        >
                            {false ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Please wait...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </form>
                </Form>
                
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Message Suggestions</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full bg-gray-200 text-black hover:bg-gray-300 transition p-2 rounded-lg"
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                    <Button
                        onClick={handleNewSuggestions}
                        className="mt-4 w-full bg-black text-white rounded-lg p-3 hover:bg-blue-600 transition"
                    >
                        Get New Suggestions
                    </Button>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p>
                    Want to use SneakTalk?{" "}
                    <Link href="/sign-in" className="text-blue-500 hover:underline">
                        <Button className="w-full bg-black text-white rounded-lg p-3 hover:bg-blue-700 transition">
                            See Yours
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default PublicUser;
