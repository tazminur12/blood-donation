import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const rentCarsCollection = db.collection("rentCars");

    const cars = await rentCarsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedCars = cars.map((car) => ({
      id: car._id.toString(),
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      type: car.type || "",
      color: car.color || "",
      transmission: car.transmission || "",
      fuelType: car.fuelType || "",
      seats: car.seats || "",
      rentPerDay: car.rentPerDay || "",
      rentPerWeek: car.rentPerWeek || "",
      rentPerMonth: car.rentPerMonth || "",
      location: car.location || "",
      contact: car.contact || "",
      ownerName: car.ownerName || "",
      description: car.description || "",
      features: car.features || [],
      status: car.status || "Available",
      insurance: car.insurance || "",
      registrationNumber: car.registrationNumber || "",
      mileage: car.mileage || "",
      condition: car.condition || "",
      additionalInfo: car.additionalInfo || "",
      createdAt: car.createdAt || null,
      updatedAt: car.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        cars: formattedCars,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching rent cars:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rent cars" },
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

    const userEmail = session.user.email;

    const newCar = {
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
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await rentCarsCollection.insertOne(newCar);

    const createdCar = await rentCarsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedCar = {
      id: createdCar._id.toString(),
      brand: createdCar.brand || "",
      model: createdCar.model || "",
      year: createdCar.year || "",
      type: createdCar.type || "",
      color: createdCar.color || "",
      transmission: createdCar.transmission || "",
      fuelType: createdCar.fuelType || "",
      seats: createdCar.seats || "",
      rentPerDay: createdCar.rentPerDay || "",
      rentPerWeek: createdCar.rentPerWeek || "",
      rentPerMonth: createdCar.rentPerMonth || "",
      location: createdCar.location || "",
      contact: createdCar.contact || "",
      ownerName: createdCar.ownerName || "",
      description: createdCar.description || "",
      features: createdCar.features || [],
      status: createdCar.status || "Available",
      insurance: createdCar.insurance || "",
      registrationNumber: createdCar.registrationNumber || "",
      mileage: createdCar.mileage || "",
      condition: createdCar.condition || "",
      additionalInfo: createdCar.additionalInfo || "",
      createdAt: createdCar.createdAt || null,
      updatedAt: createdCar.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "গাড়ি সফলভাবে যোগ হয়েছে",
        car: formattedCar,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rent car:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create rent car" },
      { status: 500 }
    );
  }
}

