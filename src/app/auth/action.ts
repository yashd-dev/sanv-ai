"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function Githublogin() {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
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

export async function GoogleSignup() {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/auth/gcallback`,
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
