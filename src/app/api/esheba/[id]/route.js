import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

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
    const body = await request.json();
    const {
      title,
      description,
      category,
      subCategory,
      status,
      priority,
      websiteUrl,
      applicationUrl,
      requirements,
      processingTime,
      fees,
      contactInfo,
      officeHours,
      location,
      documents,
      instructions,
      benefits,
      eligibility,
    } = body;

    // Validation
    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const eshebaCollection = db.collection("esheba");

    // Check if service exists
    const existingService = await eshebaCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    const updateData = {
      title,
      description,
      category,
      subCategory: subCategory || "",
      status: status || "Active",
      priority: priority || "Normal",
      websiteUrl: websiteUrl || "",
      applicationUrl: applicationUrl || "",
      requirements: requirements || "",
      processingTime: processingTime || "",
      fees: fees || "",
      contactInfo: contactInfo || "",
      officeHours: officeHours || "",
      location: location || "",
      documents: documents || "",
      instructions: instructions || "",
      benefits: benefits || "",
      eligibility: eligibility || "",
      updatedAt: new Date(),
    };

    await eshebaCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedService = await eshebaCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedService = {
      id: updatedService._id.toString(),
      title: updatedService.title || "",
      description: updatedService.description || "",
      category: updatedService.category || "",
      subCategory: updatedService.subCategory || "",
      status: updatedService.status || "Active",
      priority: updatedService.priority || "Normal",
      websiteUrl: updatedService.websiteUrl || "",
      applicationUrl: updatedService.applicationUrl || "",
      requirements: updatedService.requirements || "",
      processingTime: updatedService.processingTime || "",
      fees: updatedService.fees || "",
      contactInfo: updatedService.contactInfo || "",
      officeHours: updatedService.officeHours || "",
      location: updatedService.location || "",
      documents: updatedService.documents || "",
      instructions: updatedService.instructions || "",
      benefits: updatedService.benefits || "",
      eligibility: updatedService.eligibility || "",
      createdAt: updatedService.createdAt || null,
      updatedAt: updatedService.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "ই-সেবা সফলভাবে আপডেট করা হয়েছে",
        esheba: formattedService,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating esheba service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update esheba service" },
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
    const eshebaCollection = db.collection("esheba");

    const result = await eshebaCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "ই-সেবা সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting esheba service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete esheba service" },
      { status: 500 }
    );
  }
}

