
// "use client"

// import MessageCard from "@/components/MessageCard"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"
// import { Message } from "@/model/User"
// import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
// import { ApiResponse } from "@/types/ApiResponse"
// import { zodResolver } from "@hookform/resolvers/zod"
// import axios, { AxiosError } from "axios"
// import { Loader2, RefreshCcw } from "lucide-react"
// import { User } from "next-auth"
// import { useSession } from "next-auth/react"
// import { useCallback, useEffect, useState } from "react"
// import { useForm } from "react-hook-form"

// function UserDashboard() {
//   const [messages, setMessages] = useState<Message[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false)
//   const { toast } = useToast()
//   const { data: session } = useSession()
//   const form = useForm({
//     resolver: zodResolver(acceptMessageSchema)
//   })
//   const { register, watch, setValue } = form
//   const acceptMessages = watch('acceptMessages')

//   const fetchAcceptMessage = useCallback(async () => {
//     setIsSwitchLoading(true)
//     try {
//       const response = await axios.get('/api/accept-messages')
//       setValue('acceptMessages', response.data.isAcceptingMessages)
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>
//       toast({
//         title: "Error",
//         description: axiosError.response?.data.message || "Failed to fetch message settings",
//         variant: "destructive"
//       })
//     } finally {
//       setIsSwitchLoading(false)
//     }
//   }, [setValue, toast])

//   const fetchMessages = useCallback(async (refresh: boolean = false) => {
//     setIsLoading(true)
//     setIsSwitchLoading(true)
//     try {
//       const response = await axios.get('/api/get-messages')
//       setMessages(response.data.message || [])
//       if (refresh) {
//         toast({
//           title: "Refreshed messages",
//           description: "Showing latest messages",
//         })
//       }
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>
//       toast({
//         title: "Error",
//         description: axiosError.response?.data.message || "Failed to fetch messages",
//         variant: "destructive"
//       })
//     } finally {
//       setIsLoading(false)
//       setIsSwitchLoading(false)
//     }
//   }, [toast])

//   useEffect(() => {
//     if (session && session.user) {
//       fetchMessages()
//       fetchAcceptMessage()
//     }
//   }, [session, fetchAcceptMessage, fetchMessages])

//   const handleSwitchChange = async () => {
//     try {
//       const response = await axios.post<ApiResponse>('/api/accept-messages', {
//         acceptMessages: !acceptMessages
//       })
//       setValue('acceptMessages', !acceptMessages)
//       toast({
//         title: response.data.message,
//         variant: "default"
//       })
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>
//       toast({
//         title: "Error",
//         description: axiosError.response?.data.message || "Failed to update message settings",
//         variant: "destructive"
//       })
//     }
//   }

//   const username = session?.user.username || "User"
//   const baseUrl = `${window.location.protocol}//${window.location.host}`
//   const profileUrl = `${baseUrl}/u/${username}`

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl)
//     toast({
//       title: "Copied link",
//       description: "Profile URL has been copied to clipboard",
//       variant: "default"
//     })
//   }

//   const handleDeleteMessage = (messageId: string) => {
//     setMessages(messages.filter((message) => message._id !== messageId))
//   }

//     if (!session || !session.user) {
//     return <div>Please Login</div>
//   }
 

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Copy your unique link</h2>
//         <div className="flex items-center space-x-2">
//           <input
//             type="text"
//             value={profileUrl}
//             disabled
//             className="flex-1 p-2 border border-gray-300 rounded-md"
//           />
//           <Button onClick={copyToClipboard}>Copy</Button>
//         </div>
//       </div>
//       <div className="flex items-center mb-4">
//         <Switch
//           {...register('acceptMessages')}
//           checked={acceptMessages}
//           onCheckedChange={handleSwitchChange}
//           disabled={isSwitchLoading}
//         />
//         <span className="ml-2 text-lg">
//           Accept Messages: <strong>{acceptMessages ? 'On' : 'Off'}</strong>
//         </span>
//       </div>
//       <Separator className="mb-4" />
//       <Button
//         variant="outline"
//         onClick={(e) => {
//           e.preventDefault()
//           fetchMessages(true)
//         }}
//         className="mb-4"
//       >
//         {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
//       </Button>
//       <div>
      
//         {messages.length > 0 ? (
//           messages.map((message) => (
//             <MessageCard
//               key={message._id}
//               message={message}
//               onMessageDelete={handleDeleteMessage}
//             />
//           ))
//         ) : (
//           <p className="text-gray-500">No messages to display.</p>
//         )}
//       </div>
//     </div>
//   )
// }

// export default UserDashboard

"use client"

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/get-messages');
      setMessages(response.data.message || []);
      if (refresh) {
        toast({
          title: "Refreshed messages",
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "No messages found",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session && session.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default"
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "error",
        description: axiosError.response?.data.message || "Failed to update message settings",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }

  // Profile URL logic moved to useEffect to ensure window is available
  const [profileUrl, setProfileUrl] = useState("");
  useEffect(() => {
    if (session?.user) {
      const username = session.user.username || "User";
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [session]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied link",
      description: "Profile URL has been copied to clipboard",
      variant: "default"
    });
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`/api/delete-message/${messageId}`);
      setMessages(messages.filter((message) => message._id !== messageId));
      toast({
        title: "Message deleted",
        variant: "default"
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to delete message",
        variant: "destructive"
      });
    }
  }

  // console messages
  // messages&&console.log(messages)
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Copy your unique link</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-lg">
          Accept Messages: <strong>{acceptMessages ? 'On' : 'Off'}</strong>
        </span>
      </div>
      <Separator className="mb-4" />
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
        className="mb-4"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
      </Button>
      <div>
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-500">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
