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
      type,
      address,
      phone,
      email,
      website,
      description,
      cuisine,
      priceRange,
      rating,
      capacity,
      openingHours,
      closingHours,
      features,
      specialties,
      parking,
      wifi,
      delivery,
      takeaway,
      dineIn,
      status,
      location,
    } = body;

    // Validation
    if (!name || !type || !address || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, type, address, and phone are required" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const restaurantsCollection = db.collection("restaurants");

    // Check if restaurant exists
    const existingRestaurant = await restaurantsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingRestaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const updateData = {
      name,
      type,
      address,
      phone,
      email: email || "",
      website: website || "",
      description: description || "",
      cuisine: cuisine || "",
      priceRange: priceRange || "",
      rating: rating || "",
      capacity: capacity || "",
      openingHours: openingHours || "",
      closingHours: closingHours || "",
      features: features || "",
      specialties: specialties || "",
      parking: parking || "",
      wifi: wifi || "",
      delivery: delivery || false,
      takeaway: takeaway || false,
      dineIn: dineIn || false,
      status: status || "Active",
      location: location || {
        city: "গোবিন্দগঞ্জ",
        district: "বগুড়া",
        division: "রাজশাহী",
      },
      updatedAt: new Date(),
    };

    await restaurantsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedRestaurant = await restaurantsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedRestaurant = {
      id: updatedRestaurant._id.toString(),
      name: updatedRestaurant.name || "",
      type: updatedRestaurant.type || "",
      address: updatedRestaurant.address || "",
      phone: updatedRestaurant.phone || "",
      email: updatedRestaurant.email || "",
      website: updatedRestaurant.website || "",
      description: updatedRestaurant.description || "",
      cuisine: updatedRestaurant.cuisine || "",
      priceRange: updatedRestaurant.priceRange || "",
      rating: updatedRestaurant.rating || "",
      capacity: updatedRestaurant.capacity || "",
      openingHours: updatedRestaurant.openingHours || "",
      closingHours: updatedRestaurant.closingHours || "",
      features: updatedRestaurant.features || "",
      specialties: updatedRestaurant.specialties || "",
      parking: updatedRestaurant.parking || "",
      wifi: updatedRestaurant.wifi || "",
      delivery: updatedRestaurant.delivery || false,
      takeaway: updatedRestaurant.takeaway || false,
      dineIn: updatedRestaurant.dineIn || false,
      status: updatedRestaurant.status || "Active",
      location: updatedRestaurant.location || {},
      createdAt: updatedRestaurant.createdAt || null,
      updatedAt: updatedRestaurant.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "রেস্টুরেন্ট সফলভাবে আপডেট করা হয়েছে",
        restaurant: formattedRestaurant,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update restaurant" },
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
    const restaurantsCollection = db.collection("restaurants");

    const result = await restaurantsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "রেস্টুরেন্ট সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete restaurant" },
      { status: 500 }
    );
  }
}

