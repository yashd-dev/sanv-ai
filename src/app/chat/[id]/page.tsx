import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

type PageParams = Promise<{
  params: { id: string };
}>;

export default async function ChatPage({ params }: { params: PageParams }) {
  const { params: resolvedParams } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!session) {
    redirect("/dashboard");
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", resolvedParams.id)
    .order("created_at", { ascending: true });

  return (
    <ChatClient session={session} messages={messages || []} userId={user.id} />
  );
}
