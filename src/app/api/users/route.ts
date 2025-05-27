import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, username, password } = await request.json();

    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Error checking existing user" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await hash(password, 10);

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([
        {
          email,
          username,
          password_hash: passwordHash,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: "Error creating user" },
        { status: 500 }
      );
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in user creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
