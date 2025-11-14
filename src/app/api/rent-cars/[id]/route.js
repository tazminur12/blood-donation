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
      brand,
      model,
      year,
      type,
      color,
      transmission,
      fuelType,
      seats,
      rentPerDay,
      rentPerWeek,
      rentPerMonth,
      location,
      contact,
      ownerName,
      description,
      features,
      status,
      insurance,
      registrationNumber,
      mileage,
      condition,
      additionalInfo,
    } = body;

    // Validation
    if (!brand || !model || !year || !type || !rentPerDay || !location || !contact || !ownerName) {
      return NextResponse.json(
        { success: false, error: "Brand, model, year, type, rentPerDay, location, contact, and ownerName are required" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(contact)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1990 || year > currentYear + 1) {
      return NextResponse.json(
        { success: false, error: "Invalid year" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const rentCarsCollection = db.collection("rentCars");

    // Check if car exists
    const existingCar = await rentCarsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    const updateData = {
      brand,
      model,
      year: parseInt(year),
      type,
      color: color || "",
      transmission: transmission || "",
      fuelType: fuelType || "",
      seats: seats ? parseInt(seats) : "",
      rentPerDay: parseFloat(rentPerDay),
      rentPerWeek: rentPerWeek ? parseFloat(rentPerWeek) : "",
      rentPerMonth: rentPerMonth ? parseFloat(rentPerMonth) : "",
      location,
      contact,
      ownerName,
      description: description || "",
      features: features || [],
      status: status || "Available",
      insurance: insurance || "",
      registrationNumber: registrationNumber || "",
      mileage: mileage ? parseFloat(mileage) : "",
      condition: condition || "",
      additionalInfo: additionalInfo || "",
      updatedAt: new Date(),
    };

    await rentCarsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedCar = await rentCarsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedCar = {
      id: updatedCar._id.toString(),
      brand: updatedCar.brand || "",
      model: updatedCar.model || "",
      year: updatedCar.year || "",
      type: updatedCar.type || "",
      color: updatedCar.color || "",
      transmission: updatedCar.transmission || "",
      fuelType: updatedCar.fuelType || "",
      seats: updatedCar.seats || "",
      rentPerDay: updatedCar.rentPerDay || "",
      rentPerWeek: updatedCar.rentPerWeek || "",
      rentPerMonth: updatedCar.rentPerMonth || "",
      location: updatedCar.location || "",
      contact: updatedCar.contact || "",
      ownerName: updatedCar.ownerName || "",
      description: updatedCar.description || "",
      features: updatedCar.features || [],
      status: updatedCar.status || "Available",
      insurance: updatedCar.insurance || "",
      registrationNumber: updatedCar.registrationNumber || "",
      mileage: updatedCar.mileage || "",
      condition: updatedCar.condition || "",
      additionalInfo: updatedCar.additionalInfo || "",
      createdAt: updatedCar.createdAt || null,
      updatedAt: updatedCar.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "গাড়ি সফলভাবে আপডেট করা হয়েছে",
        car: formattedCar,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating rent car:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update rent car" },
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
    const rentCarsCollection = db.collection("rentCars");

    const result = await rentCarsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "গাড়ি সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting rent car:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete rent car" },
      { status: 500 }
    );
  }
}

