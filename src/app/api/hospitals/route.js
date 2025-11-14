import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const hospitalsCollection = db.collection("hospitals");

    const hospitals = await hospitalsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedHospitals = hospitals.map((hospital) => ({
      id: hospital._id.toString(),
      name: hospital.name || "",
      image: hospital.image || "",
      location: hospital.location || "",
      address: hospital.address || "",
      phoneNumber: hospital.phoneNumber || "",
      email: hospital.email || "",
      website: hospital.website || "",
      description: hospital.description || "",
      division: hospital.division || "",
      district: hospital.district || "",
      upazila: hospital.upazila || "",
      postedBy: hospital.postedBy || "",
      createdAt: hospital.createdAt || null,
      updatedAt: hospital.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        hospitals: formattedHospitals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hospitals" },
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
      image,
      location,
      address,
      phoneNumber,
      email,
      website,
      description,
      division,
      district,
      upazila,
    } = body;

    // Validation
    if (!name || !location || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Name, location, and phone number are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const hospitalsCollection = db.collection("hospitals");

    const userEmail = session.user.email;

    // Create hospital
    const newHospital = {
      name,
      image: image || "",
      location,
      address: address || "",
      phoneNumber,
      email: email || "",
      website: website || "",
      description: description || "",
      division: division || "",
      district: district || "",
      upazila: upazila || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await hospitalsCollection.insertOne(newHospital);

    // Fetch created hospital
    const createdHospital = await hospitalsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedHospital = {
      id: createdHospital._id.toString(),
      name: createdHospital.name || "",
      image: createdHospital.image || "",
      location: createdHospital.location || "",
      address: createdHospital.address || "",
      phoneNumber: createdHospital.phoneNumber || "",
      email: createdHospital.email || "",
      website: createdHospital.website || "",
      description: createdHospital.description || "",
      division: createdHospital.division || "",
      district: createdHospital.district || "",
      upazila: createdHospital.upazila || "",
      postedBy: createdHospital.postedBy || "",
      createdAt: createdHospital.createdAt || null,
      updatedAt: createdHospital.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Hospital information posted successfully",
        hospital: formattedHospital,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating hospital:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post hospital information" },
      { status: 500 }
    );
  }
}

