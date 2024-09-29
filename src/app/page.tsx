"use client"
import { useEffect, useState } from 'react';
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const typingSpeed = 70; 
const subTypingSpeed = 50; 
const reverseTypingSpeed = 50; 

const HomePage = () => {
  const [mainText, setMainText] = useState(' ');
  const [subText, setSubText] = useState(' ');
  const mainMessage = "Weelcome to SNEAKTALK";
  const subMessage = "  This is a place for creativity and exploration.";
  const messages=[
    {
    id:1,
    content:"How do you manage your time?"
  },
    {
    id:2,
    content:"Do you have a favorite childhood show?"
  },
    {
    id:3,
    content:"What’s your dream job?"
  },
    {
    id:4,
    content:"What do you value most in a friendship?"
  },
    {
    id:5,
    content:"What’s something new you want to learn?"
  },
    {
    id:6,
    content:"How do you handle failure?"
  },
]


  useEffect(() => {
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < mainMessage.length) {
        setMainText((prev) => prev + mainMessage.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        startSubTextTyping();
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  const startSubTextTyping = () => {
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < subMessage.length) {
        setSubText((prev) => prev + subMessage.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        reverseSubText(); 
      }
    }, subTypingSpeed);
  };

  const reverseSubText = () => {
    let index = subMessage.length;

    const reverseInterval = setInterval(() => {
      if (index > 0) { 
        setSubText(subMessage.substring(0, index));
        index--;
      } else {
        clearInterval(reverseInterval);
        setTimeout(() => {
          setSubText(''); 
          startSubTextTyping();
        }, 10); 
      }
    }, reverseTypingSpeed);
  };

  return (<>
    <div className="flex flex-col justify-start items-center h-screen bg-gray-100 p-10">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">{mainText}</h1>
      <h2 className="text-3xl font-semibold text-gray-900 mb-10 font-mono">{">"}{subText}{"<"}</h2>
      <Carousel className="w-full max-w-xs" plugins={[Autoplay({ delay: 2000 })]}>
  <CarouselContent>
    {messages.map((message, index) => (
      <CarouselItem key={index}>
        <div className="p-1">
          <Card>
            <CardContent className="flex aspect-square items-center justify-center p-6 bg-gray-200 rounded-lg">
              <span className="text-2xl md:text-4xl font-bold text-blue-600 tracking-wide">
                {message.content}
              </span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>

    </div>
    
    </>
  );
};

export default HomePage;
