"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Session {
  id: string;
  title: string;
  created_at: string;
  created_by: string;
  shareable_link: string;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleCreateSession = async () => {
    try {
      const response = await fetch("/api/sessions/create", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const data = await response.json();
      if (data.sessionId) {
        router.push(`/chat/${data.sessionId}`);
      } else {
        throw new Error("No session ID received");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Sessions</h1>
          <Button onClick={handleCreateSession} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create New Session"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-500">
            No sessions found. Create your first session to get started!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/chat/${session.id}`)}
              >
                <h3 className="font-semibold mb-2">{session.title}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(session.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Share Link: {session.shareable_link}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
