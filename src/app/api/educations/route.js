import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const educationsCollection = db.collection("educations");

    const educations = await educationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedEducations = educations.map((education) => ({
      id: education._id.toString(),
      name: education.name || "",
      type: education.type || "",
      level: education.level || "",
      address: education.address || "",
      phone: education.phone || "",
      email: education.email || "",
      principal: education.principal || "",
      established: education.established || "",
      students: education.students || "",
      description: education.description || "",
      website: education.website || "",
      district: education.district || "bogura",
      upazila: education.upazila || "",
      facilities: education.facilities || [],
      images: education.images || [],
      postedBy: education.postedBy || "",
      createdAt: education.createdAt || null,
      updatedAt: education.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        educations: formattedEducations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching educations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch educations" },
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
      name,
      type,
      level,
      address,
      phone,
      email,
      principal,
      established,
      students,
      description,
      website,
      district,
      upazila,
      facilities,
      images,
    } = body;

    // Validation
    if (!name || !principal || !address || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, principal, address, and phone are required" },
        { status: 400 }
      );
    }

    // Validate phone number format (Bangladeshi mobile)
    const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid Bangladeshi mobile number format" },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const educationsCollection = db.collection("educations");

    const userEmail = session.user.email;

    const newEducation = {
      name: name.trim(),
      type: type || "school",
      level: level || "primary",
      address: address.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      principal: principal.trim(),
      established: established?.trim() || "",
      students: students?.trim() || "",
      description: description?.trim() || "",
      website: website?.trim() || "",
      district: district || "bogura",
      upazila: upazila?.trim() || "",
      facilities: facilities || [],
      images: images || [],
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await educationsCollection.insertOne(newEducation);

    // Fetch created education
    const createdEducation = await educationsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedEducation = {
      id: createdEducation._id.toString(),
      name: createdEducation.name || "",
      type: createdEducation.type || "",
      level: createdEducation.level || "",
      address: createdEducation.address || "",
      phone: createdEducation.phone || "",
      email: createdEducation.email || "",
      principal: createdEducation.principal || "",
      established: createdEducation.established || "",
      students: createdEducation.students || "",
      description: createdEducation.description || "",
      website: createdEducation.website || "",
      district: createdEducation.district || "bogura",
      upazila: createdEducation.upazila || "",
      facilities: createdEducation.facilities || [],
      images: createdEducation.images || [],
      postedBy: createdEducation.postedBy || "",
      createdAt: createdEducation.createdAt || null,
      updatedAt: createdEducation.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Education institute added successfully",
        education: formattedEducation,
        insertedId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add education institute" },
      { status: 500 }
    );
  }
}

