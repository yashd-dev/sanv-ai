// app/api/sessions/create/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateSessionTitle } from "@/utils/sessionTitleGenerator";
import { hash } from "bcrypt";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError);
      return NextResponse.json(
        { error: "Error checking user existence" },
        { status: 500 }
      );
    }

    // If user doesn't exist in users table, create them
    if (!existingUser) {
      try {
        // Generate a random password for OAuth users
        const randomPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await hash(randomPassword, 10);

        const { error: createError } = await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            username:
              user.user_metadata.full_name ||
              user.email?.split("@")[0] ||
              "user",
            password_hash: passwordHash,
            created_at: new Date().toISOString(),
          },
        ]);

        if (createError) {
          console.error("Error creating user record:", createError);
          return NextResponse.json(
            { error: "Error creating user record" },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Unexpected error during user creation:", error);
        return NextResponse.json(
          { error: "Unexpected error during user creation" },
          { status: 500 }
        );
      }
    }

    // Generate a random title
    const title = generateSessionTitle();

    // Create the session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        created_by: user.id,
        title: title,
        shareable_link: crypto.randomUUID(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error in session creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
