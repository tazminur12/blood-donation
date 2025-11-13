import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/user";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      mobile,
      password,
      photoURL,
      bloodGroup,
      division,
      district,
      upazila,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required for registration" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      name,
      email,
      mobile,
      password,
      photoURL,
      bloodGroup,
      division,
      district,
      upazila,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          image: user.image,
          bloodGroup: user.bloodGroup,
          division: user.division,
          district: user.district,
          upazila: user.upazila,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

