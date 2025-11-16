import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch a single member application by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const applicationsCollection = db.collection("memberApplications");

    const application = await applicationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const formattedApplication = {
      id: application._id.toString(),
      name: application.name || "",
      fatherName: application.fatherName || "",
      motherName: application.motherName || "",
      currentAddress: application.currentAddress || "",
      permanentAddress: application.permanentAddress || "",
      dateOfBirth: application.dateOfBirth || "",
      bloodGroup: application.bloodGroup || "",
      religion: application.religion || "",
      nationality: application.nationality || "",
      birthRegNid: application.birthRegNid || "",
      occupation: application.occupation || "",
      education: application.education || "",
      facebookId: application.facebookId || "",
      userEmail: application.userEmail || "",
      status: application.status || "pending",
      createdAt: application.createdAt || null,
      updatedAt: application.updatedAt || null,
    };

    return NextResponse.json(
      { success: true, application: formattedApplication },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching member application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// PUT - Update member application status (approve/reject)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const dbUser = await usersCollection.findOne({ email: session.user.email });
    const userRole = dbUser?.role || "donor";

    if (userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be pending, approved, or rejected" },
        { status: 400 }
      );
    }

    const applicationsCollection = db.collection("memberApplications");

    // Update application
    const updateData = {
      status: status,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Fetch updated application
    const updatedApplication = await applicationsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedApplication = {
      id: updatedApplication._id.toString(),
      name: updatedApplication.name || "",
      fatherName: updatedApplication.fatherName || "",
      motherName: updatedApplication.motherName || "",
      currentAddress: updatedApplication.currentAddress || "",
      permanentAddress: updatedApplication.permanentAddress || "",
      dateOfBirth: updatedApplication.dateOfBirth || "",
      bloodGroup: updatedApplication.bloodGroup || "",
      religion: updatedApplication.religion || "",
      nationality: updatedApplication.nationality || "",
      birthRegNid: updatedApplication.birthRegNid || "",
      occupation: updatedApplication.occupation || "",
      education: updatedApplication.education || "",
      facebookId: updatedApplication.facebookId || "",
      userEmail: updatedApplication.userEmail || "",
      status: updatedApplication.status || "pending",
      notes: updatedApplication.notes || "",
      createdAt: updatedApplication.createdAt || null,
      updatedAt: updatedApplication.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: `Application ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "updated"} successfully`,
        application: formattedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating member application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// DELETE - Delete member application (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const dbUser = await usersCollection.findOne({ email: session.user.email });
    const userRole = dbUser?.role || "donor";

    if (userRole !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid application ID" },
        { status: 400 }
      );
    }

    const applicationsCollection = db.collection("memberApplications");

    const result = await applicationsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Application deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting member application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete application" },
      { status: 500 }
    );
  }
}

