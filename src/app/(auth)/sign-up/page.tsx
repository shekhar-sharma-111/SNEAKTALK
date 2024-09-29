

// import React from 'react'

// function SignUp() {
//   return (
//     <div>Sign-up</div>
//   )
// }

// export default SignUp


"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          console.log(response.data.message)
          setUsernameMessage(response.data.message);

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Sign up successful',
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message ?? "Error signing up";
      toast({
        title: 'Sign up failed',
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  try {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <Form {...form}>
            <>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className="border rounded-lg p-2 w-full"
                          placeholder="username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername && <Loader2 className="inline-block ml-2 animate-spin" />}
                      {usernameMessage && (
                        <p className={`mt-1 text-sm ${usernameMessage.includes("available") ? "text-green-600" : "text-red-600"}`}>
                          {usernameMessage}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className="border rounded-lg p-2 w-full"
                          placeholder="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="border rounded-lg p-2 w-full"
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Please wait...
                    </>
                  ) : 'Sign Up'}
                </Button>
              </form>
            </>
          </Form>
          <div className="mt-4 text-center">
            <p>
              Already a member? <Link href="/sign-in" className="text-blue-500 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering SignUpForm:", error);
    return <div>Error: {error.message}</div>;
  }
};

export default SignUpForm;