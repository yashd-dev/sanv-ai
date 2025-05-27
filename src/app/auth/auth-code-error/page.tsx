"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AuthError() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">
              Authentication Error
            </h1>
            <p className="text-gray-600">
              There was a problem authenticating your account. This could be due
              to:
            </p>
            <ul className="text-left list-disc list-inside text-gray-600 space-y-2">
              <li>Invalid or expired authentication code</li>
              <li>Network connectivity issues</li>
              <li>Server-side processing error</li>
            </ul>
            <div className="pt-4 space-x-4">
              <Button
                onClick={() => router.push("/auth")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
