import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const reportsCollection = db.collection("disaster-reports");

    const report = await reportsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    const formattedReport = {
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
    };

    return NextResponse.json(
      {
        success: true,
        report: formattedReport,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching disaster report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch disaster report" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const location = formData.get("location") || "";
    const category = formData.get("category") || "other";
    const priority = formData.get("priority") || "medium";
    const evidence = formData.get("evidence") || "";
    const contactInfo = formData.get("contactInfo") || "";
    const status = formData.get("status") || "pending";

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const reportsCollection = db.collection("disaster-reports");

    // Check if report exists
    const existingReport = await reportsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingReport) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    // Handle file uploads
    const attachments = formData.getAll("attachments");
    const images = [];

    attachments.forEach((file) => {
      if (file instanceof File) {
        images.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    });

    const updateData = {
      title,
      description,
      location,
      category,
      priority,
      evidence,
      contactInfo,
      status,
      images: images.length > 0 ? images : existingReport.images || [],
      updatedAt: new Date(),
    };

    await reportsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedReport = await reportsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedReport = {
      id: updatedReport._id.toString(),
      title: updatedReport.title || "",
      description: updatedReport.description || "",
      location: updatedReport.location || "",
      category: updatedReport.category || "other",
      priority: updatedReport.priority || "medium",
      evidence: updatedReport.evidence || "",
      contactInfo: updatedReport.contactInfo || "",
      status: updatedReport.status || "pending",
      images: updatedReport.images || [],
      createdAt: updatedReport.createdAt || null,
      updatedAt: updatedReport.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "রিপোর্ট সফলভাবে আপডেট করা হয়েছে",
        report: formattedReport,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating disaster report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update disaster report" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const reportsCollection = db.collection("disaster-reports");

    const result = await reportsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date(),
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    const updatedReport = await reportsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedReport = {
      id: updatedReport._id.toString(),
      title: updatedReport.title || "",
      description: updatedReport.description || "",
      location: updatedReport.location || "",
      category: updatedReport.category || "other",
      priority: updatedReport.priority || "medium",
      evidence: updatedReport.evidence || "",
      contactInfo: updatedReport.contactInfo || "",
      status: updatedReport.status || "pending",
      images: updatedReport.images || [],
      createdAt: updatedReport.createdAt || null,
      updatedAt: updatedReport.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "রিপোর্টের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে",
        report: formattedReport,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating disaster report status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update disaster report status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const reportsCollection = db.collection("disaster-reports");

    const result = await reportsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting disaster report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete disaster report" },
      { status: 500 }
    );
  }
}

