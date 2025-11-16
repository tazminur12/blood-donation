import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// POST - Submit member application
export async function POST(request) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const {
      name,
      fatherName,
      motherName,
      currentAddress,
      permanentAddress,
      dateOfBirth,
      bloodGroup,
      religion,
      nationality,
      birthRegNid,
      occupation,
      education,
      facebookId,
    } = body;

    // Validate required fields
    if (!name || !fatherName || !motherName) {
      return NextResponse.json(
        { 
          success: false,
          error: "নাম, পিতার নাম এবং মাতার নাম আবশ্যক" 
        },
        { status: 400 }
      );
    }

    if (!currentAddress || !permanentAddress) {
      return NextResponse.json(
        { 
          success: false,
          error: "বর্তমান ঠিকানা এবং স্থায়ী ঠিকানা আবশ্যক" 
        },
        { status: 400 }
      );
    }

    if (!dateOfBirth || !bloodGroup || !religion || !nationality) {
      return NextResponse.json(
        { 
          success: false,
          error: "জন্ম তারিখ, রক্তের গ্রুপ, ধর্ম এবং জাতীয়তা আবশ্যক" 
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const applicationsCollection = db.collection("memberApplications");

    // Get user email if logged in
    const userEmail = session?.user?.email || null;

    // Check if application already exists (by email if logged in, or by name and date of birth)
    let existingApplication;
    if (userEmail) {
      existingApplication = await applicationsCollection.findOne({
        userEmail: userEmail,
      });
    } else {
      existingApplication = await applicationsCollection.findOne({
        name: name.trim(),
        dateOfBirth: dateOfBirth,
      });
    }

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error: userEmail 
            ? "আপনার ইতিমধ্যে একটি আবেদন জমা দেওয়া হয়েছে"
            : "এই নাম এবং জন্ম তারিখ দিয়ে ইতিমধ্যে একটি আবেদন জমা দেওয়া হয়েছে",
        },
        { status: 400 }
      );
    }

    // Create application document
    const applicationData = {
      name: name.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      currentAddress: currentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      dateOfBirth: dateOfBirth,
      bloodGroup: bloodGroup,
      religion: religion,
      nationality: nationality.trim(),
      birthRegNid: birthRegNid?.trim() || "",
      occupation: occupation?.trim() || "",
      education: education?.trim() || "",
      facebookId: facebookId?.trim() || "",
      userEmail: userEmail, // Link to user account
      status: "pending", // pending, approved, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await applicationsCollection.insertOne(applicationData);

    return NextResponse.json(
      {
        success: true,
        message: "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে",
        applicationId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting member application:", error);
    return NextResponse.json(
      {
        success: false,
        error: "আবেদন জমা দেওয়ার সময় একটি সমস্যা হয়েছে",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all member applications (for admin)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const applicationsCollection = db.collection("memberApplications");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build filter
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { fatherName: { $regex: search, $options: "i" } },
        { motherName: { $regex: search, $options: "i" } },
        { currentAddress: { $regex: search, $options: "i" } },
        { permanentAddress: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch applications
    const applications = await applicationsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Format applications
    const formattedApplications = applications.map((app) => ({
      id: app._id.toString(),
      name: app.name || "",
      fatherName: app.fatherName || "",
      motherName: app.motherName || "",
      currentAddress: app.currentAddress || "",
      permanentAddress: app.permanentAddress || "",
      dateOfBirth: app.dateOfBirth || "",
      bloodGroup: app.bloodGroup || "",
      religion: app.religion || "",
      nationality: app.nationality || "",
      birthRegNid: app.birthRegNid || "",
      occupation: app.occupation || "",
      education: app.education || "",
      facebookId: app.facebookId || "",
      userEmail: app.userEmail || "",
      status: app.status || "pending",
      createdAt: app.createdAt || null,
      updatedAt: app.updatedAt || null,
    }));

    // Get stats
    const totalApplications = await applicationsCollection.countDocuments({});
    const pendingApplications = await applicationsCollection.countDocuments({
      status: "pending",
    });
    const approvedApplications = await applicationsCollection.countDocuments({
      status: "approved",
    });
    const rejectedApplications = await applicationsCollection.countDocuments({
      status: "rejected",
    });

    return NextResponse.json(
      {
        success: true,
        applications: formattedApplications,
        stats: {
          total: totalApplications,
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching member applications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "আবেদনসমূহ লোড করতে ব্যর্থ হয়েছে",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

