"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function Githublogin(formData: FormData) {
  const supabase = await createClient();
  // Get the redirect param from the form (if present)
  const redirectParam = formData.get("redirect") as string | undefined;
  const nextPath = redirectParam === "create-session" ? "/chat" : "/";

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `http://localhost:3000/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    redirect("/error");
  }

  // Redirect user to GitHub OAuth URL
  if (data?.url) {
    redirect(data.url);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function GoogleSignup(formData: FormData) {
  const supabase = await createClient();
  // Get the redirect param from the form (if present)
  const redirectParam = formData.get("redirect") as string | undefined;
  const nextPath = redirectParam === "create-session" ? "/chat" : "/";

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/auth/gcallback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    redirect("/error");
  }

  if (data?.url) {
    redirect(data.url);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
