import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const lawyersCollection = db.collection("lawyers");

    const lawyers = await lawyersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedLawyers = lawyers.map((lawyer) => ({
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
    }));

    return NextResponse.json(
      {
        success: true,
        lawyers: formattedLawyers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lawyers" },
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

    const userEmail = session.user.email;

    const newLawyer = {
      name,
      phone,
      email: email || "",
      category,
      chamber: chamber || "",
      experience: experience || "",
      consultationFee: consultationFee || "",
      bio: bio || "",
      image: image || "",
      approved: false,
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await lawyersCollection.insertOne(newLawyer);

    // Fetch created lawyer
    const createdLawyer = await lawyersCollection.findOne({
      _id: result.insertedId,
    });

    const formattedLawyer = {
      id: createdLawyer._id.toString(),
      name: createdLawyer.name || "",
      phone: createdLawyer.phone || "",
      email: createdLawyer.email || "",
      category: createdLawyer.category || "",
      chamber: createdLawyer.chamber || createdLawyer.chamberAddress || "",
      experience: createdLawyer.experience || "",
      consultationFee: createdLawyer.consultationFee || "",
      bio: createdLawyer.bio || "",
      image: createdLawyer.image || "",
      approved: createdLawyer.approved !== undefined ? createdLawyer.approved : false,
      createdAt: createdLawyer.createdAt || null,
      updatedAt: createdLawyer.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Lawyer information posted successfully",
        lawyer: formattedLawyer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lawyer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post lawyer information" },
      { status: 500 }
    );
  }
}

