import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch system settings
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in settings API:", JSON.stringify(session?.user, null, 2));

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // If role is not in session, fetch from database
    let userRole = session.user.role;
    if (!userRole) {
      console.log("Role not in session, fetching from database...");
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
        console.log("Role from database:", userRole);
      }
    }

    console.log("Final user role:", userRole);

    // Check if user is admin
    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
          message: `Your current role is "${userRole}". Please contact an admin to change your role.`
        },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const settings = db.collection("systemSettings");

    // Fetch system settings or return defaults
    let systemSettings = await settings.findOne({ type: "system" });
    
    if (!systemSettings) {
      // Return default settings
      systemSettings = {
        general: {
          siteName: "Blood Donation",
          siteDescription: "Life Saving Platform",
          maintenanceMode: false,
          registrationEnabled: true,
          allowPublicDonorSearch: true,
        },
        email: {
          enabled: true,
          smtpHost: "",
          smtpPort: 587,
          smtpUser: "",
          smtpPassword: "",
          fromEmail: "",
          fromName: "Blood Donation",
        },
        sms: {
          enabled: false,
          provider: "",
          apiKey: "",
          senderId: "",
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          donorRegistrationAlert: true,
          bloodRequestAlert: true,
          campaignAlert: true,
        },
        security: {
          requireEmailVerification: false,
          requirePhoneVerification: false,
          minPasswordLength: 8,
          sessionTimeout: 24, // hours
          maxLoginAttempts: 5,
        },
        features: {
          donorRegistration: true,
          bloodRequest: true,
          campaigns: true,
          bloodDrives: true,
          volunteerManagement: true,
          analytics: true,
        },
        database: {
          name: DB_NAME,
          connectionStatus: "connected",
        },
      };
    }

    // Get database stats
    const users = db.collection("users");
    const campaigns = db.collection("campaigns");
    const drives = db.collection("bloodDrives");
    
    const dbStats = {
      totalUsers: await users.countDocuments({}),
      totalCampaigns: 0,
      totalDrives: 0,
    };

    try {
      dbStats.totalCampaigns = await campaigns.countDocuments({});
    } catch (e) {
      console.log("Campaigns collection not found");
    }

    try {
      dbStats.totalDrives = await drives.countDocuments({});
    } catch (e) {
      console.log("BloodDrives collection not found");
    }

    return NextResponse.json({ 
      settings: systemSettings,
      dbStats: dbStats,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch settings",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update system settings
export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // If role is not in session, fetch from database
    let userRole = session.user.role;
    if (!userRole) {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
      }
    }

    // Check if user is admin
    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: "Settings data is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const systemSettings = db.collection("systemSettings");

    // Update or insert settings
    const result = await systemSettings.updateOne(
      { type: "system" },
      {
        $set: {
          ...settings,
          type: "system",
          updatedAt: new Date(),
          updatedBy: session.user.email,
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Settings updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { 
        error: "Failed to update settings",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

