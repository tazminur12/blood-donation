import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doctorsCollection = db.collection("doctors");

    const doctors = await doctorsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor._id.toString(),
      name: doctor.name || "",
      image: doctor.image || "",
      location: doctor.location || "",
      address: doctor.address || "",
      phoneNumber: doctor.phoneNumber || "",
      email: doctor.email || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience || "",
      chamber: doctor.chamber || "",
      hospital: doctor.hospital || "",
      availability: doctor.availability || "",
      fee: doctor.fee || 0,
      description: doctor.description || "",
      postedBy: doctor.postedBy || "",
      createdAt: doctor.createdAt || null,
      updatedAt: doctor.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        doctors: formattedDoctors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
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
      specialization,
      qualification,
      experience,
      chamber,
      hospital,
      availability,
      fee,
      description,
    } = body;

    // Validation
    if (!name || !specialization || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Name, specialization, and phone number are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const doctorsCollection = db.collection("doctors");

    const userEmail = session.user.email;

    // Create doctor
    const newDoctor = {
      name,
      image: image || "",
      location: location || "",
      address: address || "",
      phoneNumber,
      email: email || "",
      specialization: specialization || "",
      qualification: qualification || "",
      experience: experience || "",
      chamber: chamber || "",
      hospital: hospital || "",
      availability: availability || "",
      fee: fee ? parseInt(fee, 10) || 0 : 0,
      description: description || "",
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await doctorsCollection.insertOne(newDoctor);

    // Fetch created doctor
    const createdDoctor = await doctorsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedDoctor = {
      id: createdDoctor._id.toString(),
      name: createdDoctor.name || "",
      image: createdDoctor.image || "",
      location: createdDoctor.location || "",
      address: createdDoctor.address || "",
      phoneNumber: createdDoctor.phoneNumber || "",
      email: createdDoctor.email || "",
      specialization: createdDoctor.specialization || "",
      qualification: createdDoctor.qualification || "",
      experience: createdDoctor.experience || "",
      chamber: createdDoctor.chamber || "",
      hospital: createdDoctor.hospital || "",
      availability: createdDoctor.availability || "",
      fee: createdDoctor.fee || 0,
      description: createdDoctor.description || "",
      postedBy: createdDoctor.postedBy || "",
      createdAt: createdDoctor.createdAt || null,
      updatedAt: createdDoctor.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Doctor information posted successfully",
        doctor: formattedDoctor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post doctor information" },
      { status: 500 }
    );
  }
}

