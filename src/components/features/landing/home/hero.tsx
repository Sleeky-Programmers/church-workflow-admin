"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Span, Text } from "@/components/ui/typography/Text";
import Heading from "@/components/ui/typography/Heading";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div
          className={`space-y-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Heading level={1} className="leading-tight">
            All Your Church
            <br />
            Workflow Processes
            <br />
            In One Place
          </Heading>
          <Text variant="default" className="max-w-lg">
            Manage your church administration, members, services, and activities
            seamlessly. From attendance tracking to event planning, everything
            your church needs to thrive is built in.
          </Text>
          <Button size="lg" variant="default">
            Get Started
            <Span variant="default" className="ml-2">
              →
            </Span>
          </Button>
        </div>
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <div className="relative perspective-1000">
            <div className="relative bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <div className="bg-white rounded-2xl overflow-hidden shadow-inner">
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                <div className="aspect-video bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
                  </div>

                  <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-lg backdrop-blur-sm animate-float"></div>
                  <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-lg backdrop-blur-sm animate-float animation-delay-2000"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-white/10 rounded-lg backdrop-blur-sm animate-float animation-delay-4000"></div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <div className="w-32 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-b-lg shadow-lg"></div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-400 rounded-2xl opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-2xl opacity-20 blur-2xl animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
