import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid lawyer ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const lawyersCollection = db.collection("lawyers");

    const lawyer = await lawyersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!lawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }

    const formattedLawyer = {
      id: lawyer._id.toString(),
      name: lawyer.name || "",
      phone: lawyer.phone || "",
      email: lawyer.email || "",
      category: lawyer.category || "",
      chamber: lawyer.chamber || lawyer.chamberAddress || "",
      experience: lawyer.experience || "",
      consultationFee: lawyer.consultationFee || "",
      bio: lawyer.bio || "",
      image: lawyer.image || "",
      approved: lawyer.approved !== undefined ? lawyer.approved : false,
      createdAt: lawyer.createdAt || null,
      updatedAt: lawyer.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        lawyer: formattedLawyer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching lawyer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lawyer" },
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
      phone,
      email,
      category,
      chamber,
      experience,
      consultationFee,
      bio,
      image,
    } = body;

    // Validation
    if (!name || !phone || !category || !chamber || !experience || !consultationFee) {
      return NextResponse.json(
        { success: false, error: "Name, phone, category, chamber, experience, and consultation fee are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const lawyersCollection = db.collection("lawyers");

    // Check if lawyer exists
    const existingLawyer = await lawyersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingLawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }

    // Update lawyer
    const updateData = {
      name,
      phone,
      email: email || "",
      category,
      chamber: chamber || "",
      experience: experience || "",
      consultationFee: consultationFee || "",
      bio: bio || "",
      image: image || "",
      updatedAt: new Date(),
    };

    await lawyersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated lawyer
    const updatedLawyer = await lawyersCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedLawyer = {
      id: updatedLawyer._id.toString(),
      name: updatedLawyer.name || "",
      phone: updatedLawyer.phone || "",
      email: updatedLawyer.email || "",
      category: updatedLawyer.category || "",
      chamber: updatedLawyer.chamber || updatedLawyer.chamberAddress || "",
      experience: updatedLawyer.experience || "",
      consultationFee: updatedLawyer.consultationFee || "",
      bio: updatedLawyer.bio || "",
      image: updatedLawyer.image || "",
      approved: updatedLawyer.approved !== undefined ? updatedLawyer.approved : false,
      createdAt: updatedLawyer.createdAt || null,
      updatedAt: updatedLawyer.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Lawyer information updated successfully",
        lawyer: formattedLawyer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating lawyer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lawyer information" },
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
    const lawyersCollection = db.collection("lawyers");

    // Check if lawyer exists
    const existingLawyer = await lawyersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingLawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }

    await lawyersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lawyer deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lawyer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lawyer" },
      { status: 500 }
    );
  }
}

