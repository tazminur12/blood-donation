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
      name,
      description,
      upazila,
      code,
      status,
      chairmanName,
      chairmanPhone,
      secretaryName,
      secretaryPhone,
      officeAddress,
      officePhone,
      officeEmail,
      website,
      population,
      area,
      wardCount,
      villageCount,
      establishmentDate,
    } = body;

    // Validation
    if (!name || !upazila || !code) {
      return NextResponse.json(
        { success: false, error: "Name, upazila, and code are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const unionsCollection = db.collection("unions");

    // Check if union exists
    const existingUnion = await unionsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingUnion) {
      return NextResponse.json(
        { success: false, error: "Union not found" },
        { status: 404 }
      );
    }

    const updateData = {
      name,
      description: description || "",
      upazila,
      code,
      status: status || "Active",
      chairmanName: chairmanName || "",
      chairmanPhone: chairmanPhone || "",
      secretaryName: secretaryName || "",
      secretaryPhone: secretaryPhone || "",
      officeAddress: officeAddress || "",
      officePhone: officePhone || "",
      officeEmail: officeEmail || "",
      website: website || "",
      population: population || "",
      area: area || "",
      wardCount: wardCount || "",
      villageCount: villageCount || "",
      establishmentDate: establishmentDate || "",
      updatedAt: new Date(),
    };

    await unionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedUnion = await unionsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedUnion = {
      id: updatedUnion._id.toString(),
      name: updatedUnion.name || "",
      description: updatedUnion.description || "",
      upazila: updatedUnion.upazila || "",
      code: updatedUnion.code || "",
      status: updatedUnion.status || "Active",
      chairmanName: updatedUnion.chairmanName || "",
      chairmanPhone: updatedUnion.chairmanPhone || "",
      secretaryName: updatedUnion.secretaryName || "",
      secretaryPhone: updatedUnion.secretaryPhone || "",
      officeAddress: updatedUnion.officeAddress || "",
      officePhone: updatedUnion.officePhone || "",
      officeEmail: updatedUnion.officeEmail || "",
      website: updatedUnion.website || "",
      population: updatedUnion.population || "",
      area: updatedUnion.area || "",
      wardCount: updatedUnion.wardCount || "",
      villageCount: updatedUnion.villageCount || "",
      establishmentDate: updatedUnion.establishmentDate || "",
      createdAt: updatedUnion.createdAt || null,
      updatedAt: updatedUnion.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "ইউনিয়ন সফলভাবে আপডেট করা হয়েছে",
        union: formattedUnion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating union:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update union" },
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
    const unionsCollection = db.collection("unions");

    const result = await unionsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Union not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "ইউনিয়ন সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting union:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete union" },
      { status: 500 }
    );
  }
}

