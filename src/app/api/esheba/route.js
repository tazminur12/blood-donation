import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const eshebaCollection = db.collection("esheba");

    const eshebaServices = await eshebaCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedServices = eshebaServices.map((service) => ({
      id: service._id.toString(),
      title: service.title || "",
      description: service.description || "",
      category: service.category || "",
      subCategory: service.subCategory || "",
      status: service.status || "Active",
      priority: service.priority || "Normal",
      websiteUrl: service.websiteUrl || "",
      applicationUrl: service.applicationUrl || "",
      requirements: service.requirements || "",
      processingTime: service.processingTime || "",
      fees: service.fees || "",
      contactInfo: service.contactInfo || "",
      officeHours: service.officeHours || "",
      location: service.location || "",
      documents: service.documents || "",
      instructions: service.instructions || "",
      benefits: service.benefits || "",
      eligibility: service.eligibility || "",
      createdAt: service.createdAt || null,
      updatedAt: service.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        esheba: formattedServices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching esheba services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch esheba services" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    const userEmail = session.user.email;

    const newService = {
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
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eshebaCollection.insertOne(newService);

    const createdService = await eshebaCollection.findOne({
      _id: result.insertedId,
    });

    const formattedService = {
      id: createdService._id.toString(),
      title: createdService.title || "",
      description: createdService.description || "",
      category: createdService.category || "",
      subCategory: createdService.subCategory || "",
      status: createdService.status || "Active",
      priority: createdService.priority || "Normal",
      websiteUrl: createdService.websiteUrl || "",
      applicationUrl: createdService.applicationUrl || "",
      requirements: createdService.requirements || "",
      processingTime: createdService.processingTime || "",
      fees: createdService.fees || "",
      contactInfo: createdService.contactInfo || "",
      officeHours: createdService.officeHours || "",
      location: createdService.location || "",
      documents: createdService.documents || "",
      instructions: createdService.instructions || "",
      benefits: createdService.benefits || "",
      eligibility: createdService.eligibility || "",
      createdAt: createdService.createdAt || null,
      updatedAt: createdService.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "ই-সেবা সফলভাবে যোগ হয়েছে",
        esheba: formattedService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating esheba service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create esheba service" },
      { status: 500 }
    );
  }
}

