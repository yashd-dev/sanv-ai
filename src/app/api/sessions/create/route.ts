// app/api/sessions/create/route.ts

import { NextResponse } from "next/server";
// No need to import cookies here anymore
import { createServerClient } from "../../../../lib/supabaseClient"; // Adjust path if needed

export async function POST() {
  // --- CHANGE HERE: AWAIT createServerClient() ---
  const supabase = await createServerClient(); // <--- ADD 'await' here

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Authentication error in API route:", userError);
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .insert([
        {
          owner_id: user.id,
          name: "New Collaborative Session",
        },
      ])
      .select("id")
      .single();

    if (sessionError) {
      console.error("Error inserting session into Supabase:", sessionError);
      throw sessionError;
    }

    const newSessionId = sessionData.id;

    return NextResponse.json(
      {
        sessionId: newSessionId,
        message: "Session created successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred in the API route:", error);
    return NextResponse.json(
      { error: "Internal server error during session creation" },
      { status: 500 }
    );
  }
}
