import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const reportsCollection = db.collection("disaster-reports");

    const reports = await reportsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedReports = reports.map((report) => ({
      id: report._id.toString(),
      title: report.title || "",
      description: report.description || "",
      location: report.location || "",
      category: report.category || "other",
      priority: report.priority || "medium",
      evidence: report.evidence || "",
      contactInfo: report.contactInfo || "",
      status: report.status || "pending",
      images: report.images || [],
      createdAt: report.createdAt || null,
      updatedAt: report.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        reports: formattedReports,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching disaster reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch disaster reports" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Note: For public reports, we might want to allow unauthenticated posts
    // But for now, we'll require authentication for consistency
    const session = await getServerSession();
    
    // Uncomment if you want to require authentication
    // if (!session?.user?.email) {
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location") || "";
    const category = formData.get("category") || "other";
    const priority = formData.get("priority") || "medium";
    const evidence = formData.get("evidence") || "";
    const contactInfo = formData.get("contactInfo") || "";
    const status = formData.get("status") || "pending";
    const createdAt = formData.get("createdAt") || new Date().toISOString();

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Handle file uploads (for now, we'll store file info)
    // In production, you'd want to upload to a cloud storage service
    const attachments = formData.getAll("attachments");
    const images = [];

    // For now, we'll just store file names
    // In production, upload to cloud storage and store URLs
    attachments.forEach((file) => {
      if (file instanceof File) {
        images.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    });

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const reportsCollection = db.collection("disaster-reports");

    const newReport = {
      title,
      description,
      location,
      category,
      priority,
      evidence,
      contactInfo,
      status,
      images, // In production, these would be URLs from cloud storage
      createdAt: new Date(createdAt),
      updatedAt: new Date(),
    };

    const result = await reportsCollection.insertOne(newReport);

    const createdReport = await reportsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedReport = {
      id: createdReport._id.toString(),
      title: createdReport.title || "",
      description: createdReport.description || "",
      location: createdReport.location || "",
      category: createdReport.category || "other",
      priority: createdReport.priority || "medium",
      evidence: createdReport.evidence || "",
      contactInfo: createdReport.contactInfo || "",
      status: createdReport.status || "pending",
      images: createdReport.images || [],
      createdAt: createdReport.createdAt || null,
      updatedAt: createdReport.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "রিপোর্ট সফলভাবে যোগ হয়েছে",
        report: formattedReport,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating disaster report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create disaster report" },
      { status: 500 }
    );
  }
}

