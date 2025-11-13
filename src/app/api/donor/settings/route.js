import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Get donor settings
export async function GET(request) {
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
    const userSettings = db.collection("userSettings");

    const userEmail = session.user.email;

    // Fetch user settings
    const settings = await userSettings.findOne({ email: userEmail });

    // Default settings if not found
    const defaultSettings = {
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        bloodRequestAlerts: true,
        campaignAlerts: true,
        donationReminders: true,
      },
      privacy: {
        profileVisibility: "public",
        showMobileNumber: true,
        showEmail: false,
        allowBloodRequests: true,
      },
    };

    return NextResponse.json(
      { 
        settings: settings?.settings || defaultSettings 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donor settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update donor settings
export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notifications, privacy } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userSettings = db.collection("userSettings");

    const userEmail = session.user.email;

    // Update or insert settings
    const existingSettings = await userSettings.findOne({ email: userEmail });
    
    if (existingSettings) {
      // Update existing settings - merge with existing
      const currentSettings = existingSettings.settings || {};
      const updatedSettings = {
        ...currentSettings,
        ...(notifications && { notifications }),
        ...(privacy && { privacy }),
      };

      await userSettings.updateOne(
        { email: userEmail },
        {
          $set: {
            settings: updatedSettings,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      // Insert new settings
      await userSettings.insertOne({
        email: userEmail,
        settings: {
          notifications: notifications || {
            emailNotifications: true,
            smsNotifications: false,
            bloodRequestAlerts: true,
            campaignAlerts: true,
            donationReminders: true,
          },
          privacy: privacy || {
            profileVisibility: "public",
            showMobileNumber: true,
            showEmail: false,
            allowBloodRequests: true,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Settings updated successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating donor settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

