import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthClient from "./AuthClient";

type PageParams = Promise<{
  searchParams: { redirect?: string };
}>;

export default async function AuthPage({ params }: { params: PageParams }) {
  const { searchParams } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const search = searchParams?.redirect;

  if (data.user) {
    // Fetch the user's most recent session
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id")
      .eq("created_by", data.user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (sessions && sessions.length > 0) {
      redirect(`/chat/${sessions[0].id}`);
    } else {
      // No session exists, create a new one
      const shareableLink = Math.random().toString(36).substring(2, 15);
      const { data: newSession, error: sessionError } = await supabase
        .from("sessions")
        .insert([
          {
            created_by: data.user.id,
            title: "New Collaborative Session",
            shareable_link: shareableLink,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      if (sessionError || !newSession) {
        // fallback to dashboard if session creation fails
        redirect("/dashboard");
      }
      redirect(`/chat/${newSession.id}`);
    }
  }

  return <AuthClient search={search} />;
}
