import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all blood drives
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in drives API:", JSON.stringify(session?.user, null, 2));

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
    const drives = db.collection("bloodDrives");

    // Fetch all blood drives
    const driveList = await drives
      .find({})
      .sort({ driveDate: -1, createdAt: -1 })
      .toArray();

    console.log("Blood drives fetched:", driveList.length);

    const formattedDrives = driveList.map((drive) => ({
      id: drive._id.toString(),
      title: drive.title || null,
      description: drive.description || null,
      image: drive.image || null,
      driveDate: drive.driveDate || null,
      startTime: drive.startTime || null,
      endTime: drive.endTime || null,
      venue: drive.venue || null,
      address: drive.address || null,
      location: drive.location || null,
      division: drive.division || null,
      district: drive.district || null,
      upazila: drive.upazila || null,
      status: drive.status || "scheduled",
      organizer: drive.organizer || null,
      organizerName: drive.organizerName || null,
      organizerEmail: drive.organizerEmail || null,
      organizerPhone: drive.organizerPhone || null,
      targetDonors: drive.targetDonors || 0,
      targetBloodUnits: drive.targetBloodUnits || 0,
      registeredDonors: drive.registeredDonors || 0,
      collectedBloodUnits: drive.collectedBloodUnits || 0,
      volunteers: drive.volunteers || [],
      volunteerCount: Array.isArray(drive.volunteers) ? drive.volunteers.length : 0,
      driveType: drive.driveType || "regular",
      contactPerson: drive.contactPerson || null,
      contactPhone: drive.contactPhone || null,
      notes: drive.notes || null,
      createdAt: drive.createdAt || null,
      updatedAt: drive.updatedAt || null,
    }));

    // Calculate stats
    const now = new Date();
    const stats = {
      total: formattedDrives.length,
      scheduled: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0,
      totalTargetDonors: 0,
      totalTargetBloodUnits: 0,
      totalRegisteredDonors: 0,
      totalCollectedBloodUnits: 0,
      totalVolunteers: 0,
    };

    formattedDrives.forEach((drive) => {
      const status = drive.status || "scheduled";
      
      if (status === "cancelled") {
        stats.cancelled++;
      } else if (status === "completed") {
        stats.completed++;
      } else if (status === "ongoing") {
        stats.ongoing++;
      } else {
        // Check if drive is ongoing based on date
        const driveDate = drive.driveDate ? new Date(drive.driveDate) : null;
        
        if (driveDate) {
          const driveDateOnly = new Date(driveDate.setHours(0, 0, 0, 0));
          const todayOnly = new Date(now.setHours(0, 0, 0, 0));
          
          if (driveDateOnly.getTime() === todayOnly.getTime()) {
            stats.ongoing++;
          } else if (driveDateOnly > todayOnly) {
            stats.scheduled++;
          } else {
            stats.completed++;
          }
        } else {
          stats.scheduled++;
        }
      }

      stats.totalTargetDonors += drive.targetDonors || 0;
      stats.totalTargetBloodUnits += drive.targetBloodUnits || 0;
      stats.totalRegisteredDonors += drive.registeredDonors || 0;
      stats.totalCollectedBloodUnits += drive.collectedBloodUnits || 0;
      stats.totalVolunteers += drive.volunteerCount || 0;
    });

    return NextResponse.json({ 
      drives: formattedDrives,
      stats: stats,
      total: formattedDrives.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blood drives:", error);
    
    // If bloodDrives collection doesn't exist, return empty array
    if (error.message?.includes("collection") || error.code === 26) {
      return NextResponse.json({ 
        drives: [],
        stats: {
          total: 0,
          scheduled: 0,
          ongoing: 0,
          completed: 0,
          cancelled: 0,
          totalTargetDonors: 0,
          totalTargetBloodUnits: 0,
          totalRegisteredDonors: 0,
          totalCollectedBloodUnits: 0,
          totalVolunteers: 0,
        },
        total: 0 
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch blood drives",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

