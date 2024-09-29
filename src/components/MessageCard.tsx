import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import React from 'react';
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        console.log("Attempting to delete message with ID:", message._id);
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);

            // Check if the response indicates success
            if (response.data.success) {
                toast({
                    title: response.data.message,
                    description: response.data.message,
                });
                onMessageDelete(message._id);
            } else {
                // Handle cases where the response is successful but the success flag is false
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            if (error instanceof AxiosError) {
                toast({
                    title: "Delete Failed",
                    description: error.response?.data.message || "Unknown error occurred",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Unexpected Error",
                    description: "Something went wrong!",
                    variant: "destructive",
                });
            }
        }
    };

    // Format the date
    const formattedDate = new Date(message.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // Change to false for 24-hour format
    });

    return (
        <Card 
    className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl mb-4 relative"
    style={{ 
        transition: 'transform 0.2s', 
        perspective: '1000px' 
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'rotateY(10deg) rotateX(10deg)';
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }}
>
    <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
        <CardTitle className="text-lg font-semibold text-gray-800">{message.content}</CardTitle>
        
        {/* Button positioned at the top right corner with adjusted spacing */}
        <div className="absolute top-2 right-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-700 transition duration-300 ease-in-out">
                        <X className="w-5 h-5" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            message and remove the message data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </CardHeader>
    <CardContent className="p-4 border-t border-gray-200">
        <p className="text-gray-700">{formattedDate}</p>
    </CardContent>
</Card>

    );
}

export default MessageCard;
