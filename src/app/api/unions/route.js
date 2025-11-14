import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const unionsCollection = db.collection("unions");

    const unions = await unionsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUnions = unions.map((union) => ({
      id: union._id.toString(),
      name: union.name || "",
      description: union.description || "",
      upazila: union.upazila || "",
      code: union.code || "",
      status: union.status || "Active",
      chairmanName: union.chairmanName || "",
      chairmanPhone: union.chairmanPhone || "",
      secretaryName: union.secretaryName || "",
      secretaryPhone: union.secretaryPhone || "",
      officeAddress: union.officeAddress || "",
      officePhone: union.officePhone || "",
      officeEmail: union.officeEmail || "",
      website: union.website || "",
      population: union.population || "",
      area: union.area || "",
      wardCount: union.wardCount || "",
      villageCount: union.villageCount || "",
      establishmentDate: union.establishmentDate || "",
      createdAt: union.createdAt || null,
      updatedAt: union.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        unions: formattedUnions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching unions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch unions" },
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

    const userEmail = session.user.email;

    const newUnion = {
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
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await unionsCollection.insertOne(newUnion);

    const createdUnion = await unionsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedUnion = {
      id: createdUnion._id.toString(),
      name: createdUnion.name || "",
      description: createdUnion.description || "",
      upazila: createdUnion.upazila || "",
      code: createdUnion.code || "",
      status: createdUnion.status || "Active",
      chairmanName: createdUnion.chairmanName || "",
      chairmanPhone: createdUnion.chairmanPhone || "",
      secretaryName: createdUnion.secretaryName || "",
      secretaryPhone: createdUnion.secretaryPhone || "",
      officeAddress: createdUnion.officeAddress || "",
      officePhone: createdUnion.officePhone || "",
      officeEmail: createdUnion.officeEmail || "",
      website: createdUnion.website || "",
      population: createdUnion.population || "",
      area: createdUnion.area || "",
      wardCount: createdUnion.wardCount || "",
      villageCount: createdUnion.villageCount || "",
      establishmentDate: createdUnion.establishmentDate || "",
      createdAt: createdUnion.createdAt || null,
      updatedAt: createdUnion.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "ইউনিয়ন সফলভাবে যোগ হয়েছে",
        union: formattedUnion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating union:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create union" },
      { status: 500 }
    );
  }
}

