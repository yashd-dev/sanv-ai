import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth provider errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        error
      )}&description=${encodeURIComponent(errorDescription || "Unknown error")}`
    );
  }

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=no_code&description=No authentication code provided`
    );
  }

  try {
    const supabase = await createClient();
    const {
      error: authError,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=auth_error&description=${encodeURIComponent(
          authError.message
        )}`
      );
    }

    if (!user) {
      console.error("No user data after authentication");
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=no_user&description=No user data received after authentication`
      );
    }

    // Check if user already exists in users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=db_error&description=${encodeURIComponent(
          checkError.message
        )}`
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
          return NextResponse.redirect(
            `${origin}/auth/auth-code-error?error=create_user_error&description=${encodeURIComponent(
              createError.message
            )}`
          );
        }
      } catch (error) {
        console.error("Unexpected error during user creation:", error);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=unexpected_error&description=An unexpected error occurred during user creation`
        );
      }
    }

    // Successful authentication and user creation/verification
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    console.error("Unexpected error in auth callback:", error);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=unexpected_error&description=An unexpected error occurred during authentication`
    );
  }
}
