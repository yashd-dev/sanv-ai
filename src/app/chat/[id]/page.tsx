import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

interface PageParams {
  id: string;
}

interface Session {
  id: string;
  created_at: string;
  user_id: string;
}

interface Message {
  id: string;
  session_id: string;
  sender_id: string | null; // Can be null for LLM responses
  role: "user" | "assistant";
  content: string;
  created_at: string;
  is_llm_response?: boolean;
  sequence_number: number;
}

interface ChatPageProps {
  params: Promise<PageParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  // Await the params to get the actual values
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = 20; // Number of messages per page

  console.log("Chat page - ID from params:", id);

  if (!id) {
    console.error("No ID provided in params");
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("User error:", userError);
    redirect("/auth");
  }

  if (!user?.id) {
    console.error("No user or user.id found");
    redirect("/auth");
  }

  console.log("User authenticated:", user.id);

  // Debug: Check what sessions this user has access to
  const { data: userSessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log("User's sessions:", userSessions);
  console.log("Looking for session ID:", id);

  // Get session with better error handling
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, created_at, created_by, title, shareable_link")
    .eq("id", id)
    .single();

  console.log("Session query result:", { session, sessionError, id });

  if (sessionError) {
    console.error("Session error details:", sessionError);
    redirect("/dashboard");
  }

  if (!session) {
    console.error("No session found for ID:", id);
    redirect("/dashboard");
  }

  // Check if user has access to this session (either creator or participant)
  const isCreator = session.created_by === user.id;

  if (!isCreator) {
    // Check if user is a participant
    const { data: hasAccess } = await supabase
      .from("session_participants")
      .select("id")
      .eq("session_id", id)
      .eq("user_id", user.id)
      .single();

    if (!hasAccess) {
      console.error("User doesn't have access to this session");
      redirect("/dashboard");
    }
  }

  console.log("User has access to session, isCreator:", isCreator);

  // Get messages with pagination
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true });

  // Get total count for pagination
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("session_id", id);

  console.log("Messages loaded:", messages?.length || 0, "messages");

  // Validate and transform session data
  const validSession: Session = {
    id: session.id,
    created_at: session.created_at,
    user_id: session.created_by,
  };

  // Validate and transform messages data
  const validMessages: Message[] = (messages || [])
    .sort((a, b) => {
      // First sort by sequence number
      if (a.sequence_number !== b.sequence_number) {
        return a.sequence_number - b.sequence_number;
      }
      // If sequence numbers are equal, put user messages first
      return a.is_llm_response ? 1 : -1;
    })
    .map((msg) => ({
      id: msg.id,
      session_id: msg.session_id,
      sender_id: msg.sender_id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      created_at: msg.created_at,
      is_llm_response: msg.is_llm_response,
      sequence_number: msg.sequence_number,
    }));

  console.log("Final data:", {
    userId: user.id,
    sessionId: validSession.id,
    messagesCount: validMessages.length,
    totalMessages: count,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / pageSize),
  });

  return (
    <ChatClient
      session={validSession}
      messages={validMessages}
      userId={user.id}
      pagination={{
        currentPage: page,
        totalPages: Math.ceil((count || 0) / pageSize),
        totalMessages: count || 0,
      }}
    />
  );
}
