import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// DELETE - Delete donor account
export async function DELETE(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    const userSettings = db.collection("userSettings");

    const userEmail = session.user.email;

    // Check if user exists
    const user = await users.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user account
    await users.deleteOne({ email: userEmail });

    // Delete user settings
    await userSettings.deleteOne({ email: userEmail });

    // Note: You might want to also delete related data like:
    // - Donation history
    // - Notifications
    // - Appointments
    // etc.

    return NextResponse.json(
      { 
        success: true,
        message: "Account deleted successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

