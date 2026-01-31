"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LoginScreenProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LoginScreen({
  onLogin,
  isDarkMode,
  onToggleDarkMode,
}: LoginScreenProps) {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      onLogin();
  };

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Use the main wallpaper image based on dark mode
  const wallpaper = isDarkMode ? "/mojavi-night.jpg" : "/mohave-day.jpg";

  return (
    <div
      className="h-screen w-screen bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url('${wallpaper}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="text-white text-5xl font-light mb-2">
          {formattedTime}
        </div>
        <div className="text-white text-xl font-light">{formattedDate}</div>
      </div>

      <div className="flex flex-col items-center mt-24">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center mb-4 ring-2 ring-white/20">
          <Image
            src="/hannah-profile.png"
            alt="Hannah"
            width={96}
            height={96}
            className="object-cover w-full h-full"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>
        <h2 className="text-white text-2xl font-medium mb-6">Hannah</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Button
            type="submit"
            variant="outline"
            className="bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white/30"
          >
            Login
          </Button>
        </form>
      </div>

      <div className="fixed bottom-8 flex flex-col items-center gap-4">
        <button
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <p className="text-white/40 text-xs font-light">Best viewed on desktop</p>
      </div>
    </div>
  );
}
