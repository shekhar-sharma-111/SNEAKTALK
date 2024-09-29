"use client";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {  useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import z from "zod";
function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.code,
            });
            console.log(response||"no response from verify code")
            toast({
                title: "Success",
                description: response.data.message,
            });
            router.replace("/sign-in");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMsg = axiosError.response?.data.message ?? "Error signing up";
            toast({
                title: "Sign up failed",
                description: errorMsg,
                variant: "destructive",
            });
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Verify account</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <Form {...form}>
                    <>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>verification code</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border rounded-lg p-2 w-full"
                                                placeholder="otp"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                // disabled={isSubmitting}
                                className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
                            >
                                {
                                    //   isSubmitting
                                    false ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" />
                                            Please wait...
                                        </>
                                    ) : (
                                        "Verify"
                                    )
                                }
                            </Button>
                        </form>
                    </>
                </Form>
                <div className="mt-4 text-center">
                    <p>
                        Already a member?{" "}
                        <Link href="/sign-in" className="text-blue-500 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VerifyAccount;
