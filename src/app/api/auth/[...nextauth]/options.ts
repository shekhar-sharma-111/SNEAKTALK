/* eslint-disable @typescript-eslint/no-explicit-any */


import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    console.log("Credentials received:", credentials); // Log the credentials received (without password)

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    console.log("User found:", user); // Log the user found

                    if (!user) {
                        throw new Error("No user found with this email or username");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    console.log("Password check result:", isPasswordCorrect); // Log the result of password check

                    if (isPasswordCorrect) {
                        console.log("User authenticated successfully"); // Log successful authentication
                        return user;
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    console.error("Error during authentication:", error); // Log the error details
                    throw new Error(error.message); // Throw the error message for handling in the UI
                }
            },
        }),
    ],


    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log("JWT callback - user:", user);
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            console.log("JWT callback - token:", token);
            return token;
        },
        async session({ session, token }) {
            if (token) {
                console.log("Session callback - token:", token);
                // Use type assertions to ensure correct types
                session.user._id = (token._id as string) ?? undefined;
                session.user.isVerified = (token.isVerified as boolean) ?? undefined;
                session.user.isAcceptingMessages = (token.isAcceptingMessages as boolean) ?? undefined;
                session.user.username = token.username as string;
            }
            console.log("Session callback - session:", session);
            return session;
        },
    },

    pages: {
        signIn: "/sign-in",

    },
    session: {
        strategy: "jwt",
        
    },
    secret: process.env.NEXTAUTH_SECRET || "hello_world",
};

export default authOptions;
