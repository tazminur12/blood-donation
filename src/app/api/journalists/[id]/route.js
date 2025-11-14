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
        { success: false, error: "Invalid journalist ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const journalistsCollection = db.collection("journalists");

    const journalist = await journalistsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!journalist) {
      return NextResponse.json(
        { success: false, error: "Journalist not found" },
        { status: 404 }
      );
    }

    const formattedJournalist = {
      id: journalist._id.toString(),
      name: journalist.name || "",
      email: journalist.email || "",
      phone: journalist.phone || "",
      designation: journalist.designation || "",
      mediaType: journalist.mediaType || "",
      mediaName: journalist.mediaName || "",
      mediaWebsite: journalist.mediaWebsite || "",
      beat: journalist.beat || "",
      district: journalist.district || "",
      image: journalist.image || "",
      createdAt: journalist.createdAt || null,
      updatedAt: journalist.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        journalist: formattedJournalist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching journalist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journalist" },
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
      email,
      phone,
      designation,
      mediaType,
      mediaName,
      mediaWebsite,
      beat,
      district,
      image,
    } = body;

    // Validation
    if (!name || !email || !phone || !designation || !mediaName || !beat || !district) {
      return NextResponse.json(
        { success: false, error: "Name, email, phone, designation, media name, beat, and district are required" },
        { status: 400 }
      );
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone validation
    if (!/^(?:\+88|01)?\d{11}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const journalistsCollection = db.collection("journalists");

    // Check if journalist exists
    const existingJournalist = await journalistsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingJournalist) {
      return NextResponse.json(
        { success: false, error: "Journalist not found" },
        { status: 404 }
      );
    }

    // Update journalist
    const updateData = {
      name,
      email,
      phone,
      designation,
      mediaType: mediaType || "newspaper",
      mediaName,
      mediaWebsite: mediaWebsite || "",
      beat,
      district,
      image: image || "",
      updatedAt: new Date(),
    };

    await journalistsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated journalist
    const updatedJournalist = await journalistsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedJournalist = {
      id: updatedJournalist._id.toString(),
      name: updatedJournalist.name || "",
      email: updatedJournalist.email || "",
      phone: updatedJournalist.phone || "",
      designation: updatedJournalist.designation || "",
      mediaType: updatedJournalist.mediaType || "",
      mediaName: updatedJournalist.mediaName || "",
      mediaWebsite: updatedJournalist.mediaWebsite || "",
      beat: updatedJournalist.beat || "",
      district: updatedJournalist.district || "",
      image: updatedJournalist.image || "",
      createdAt: updatedJournalist.createdAt || null,
      updatedAt: updatedJournalist.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Journalist information updated successfully",
        journalist: formattedJournalist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating journalist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update journalist information" },
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
    const journalistsCollection = db.collection("journalists");

    // Check if journalist exists
    const existingJournalist = await journalistsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingJournalist) {
      return NextResponse.json(
        { success: false, error: "Journalist not found" },
        { status: 404 }
      );
    }

    await journalistsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Journalist deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting journalist:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete journalist" },
      { status: 500 }
    );
  }
}

