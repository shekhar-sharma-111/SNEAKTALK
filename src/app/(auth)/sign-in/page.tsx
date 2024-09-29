


"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInSchema } from '@/schemas/signinSchema';
import z from "zod"
import { signIn } from 'next-auth/react';
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router=useRouter()
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true);
      console.log(data)
      try {
        console.log(data);
        const result = await signIn('credentials', {
          redirect: false,
          identifier: data.identifier,
          password: data.password
        })
        console.log(result||"signin result:",result?.error)
        if (result?.error) {
          if(result?.error=='CredentialsSignin'){
            toast({
              title: 'Login Failed',
              description: "Incorrect or password",
              variant:"destructive"
            });
          }
          else{
            toast({
            title: 'error',
            description: result.error,
            variant:"destructive"
          })
          
          ;}
        }
        if(result?.url){
          router.replace('/dashboard')
          toast({
          title: 'Logged in',
          description: "login successful",
        });
        
        
        }
        

      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMsg = axiosError.response?.data.message ?? "Error signing in";
        toast({
          title: 'Sign in failed',
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
          <h1 className="text-2xl font-bold mb-4">Sign In</h1>
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            <Form {...form}>
              <>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username or email</FormLabel>
                        <FormControl>
                          <Input
                            className="border rounded-lg p-2 w-full"
                            placeholder="identifier"
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
                    ) : 'Sign In'}
                  </Button>
                </form>
              </>
            </Form>
            <div className="mt-4 text-center">
              <p>
                Don&apos;t have account ? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
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

  export default SignInForm;