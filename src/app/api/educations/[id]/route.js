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
    const educationsCollection = db.collection("educations");

    const education = await educationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!education) {
      return NextResponse.json(
        { success: false, error: "Education institute not found" },
        { status: 404 }
      );
    }

    const formattedEducation = {
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
    };

    return NextResponse.json(
      {
        success: true,
        education: formattedEducation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch education institute" },
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

    // Check if education exists
    const existingEducation = await educationsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingEducation) {
      return NextResponse.json(
        { success: false, error: "Education institute not found" },
        { status: 404 }
      );
    }

    // Update education
    const updateData = {
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
      updatedAt: new Date(),
    };

    await educationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated education
    const updatedEducation = await educationsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedEducation = {
      id: updatedEducation._id.toString(),
      name: updatedEducation.name || "",
      type: updatedEducation.type || "",
      level: updatedEducation.level || "",
      address: updatedEducation.address || "",
      phone: updatedEducation.phone || "",
      email: updatedEducation.email || "",
      principal: updatedEducation.principal || "",
      established: updatedEducation.established || "",
      students: updatedEducation.students || "",
      description: updatedEducation.description || "",
      website: updatedEducation.website || "",
      district: updatedEducation.district || "bogura",
      upazila: updatedEducation.upazila || "",
      facilities: updatedEducation.facilities || [],
      images: updatedEducation.images || [],
      postedBy: updatedEducation.postedBy || "",
      createdAt: updatedEducation.createdAt || null,
      updatedAt: updatedEducation.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Education institute updated successfully",
        education: formattedEducation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update education institute" },
      { status: 500 }
    );
  }
}

