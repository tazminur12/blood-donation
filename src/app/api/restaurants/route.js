import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const restaurantsCollection = db.collection("restaurants");

    const restaurants = await restaurantsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedRestaurants = restaurants.map((restaurant) => ({
      id: restaurant._id.toString(),
      name: restaurant.name || "",
      type: restaurant.type || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      email: restaurant.email || "",
      website: restaurant.website || "",
      description: restaurant.description || "",
      cuisine: restaurant.cuisine || "",
      priceRange: restaurant.priceRange || "",
      rating: restaurant.rating || "",
      capacity: restaurant.capacity || "",
      openingHours: restaurant.openingHours || "",
      closingHours: restaurant.closingHours || "",
      features: restaurant.features || "",
      specialties: restaurant.specialties || "",
      parking: restaurant.parking || "",
      wifi: restaurant.wifi || "",
      delivery: restaurant.delivery || false,
      takeaway: restaurant.takeaway || false,
      dineIn: restaurant.dineIn || false,
      status: restaurant.status || "Active",
      location: restaurant.location || {},
      createdAt: restaurant.createdAt || null,
      updatedAt: restaurant.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        restaurants: formattedRestaurants,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurants" },
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

    const userEmail = session.user.email;

    const newRestaurant = {
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
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await restaurantsCollection.insertOne(newRestaurant);

    const createdRestaurant = await restaurantsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedRestaurant = {
      id: createdRestaurant._id.toString(),
      name: createdRestaurant.name || "",
      type: createdRestaurant.type || "",
      address: createdRestaurant.address || "",
      phone: createdRestaurant.phone || "",
      email: createdRestaurant.email || "",
      website: createdRestaurant.website || "",
      description: createdRestaurant.description || "",
      cuisine: createdRestaurant.cuisine || "",
      priceRange: createdRestaurant.priceRange || "",
      rating: createdRestaurant.rating || "",
      capacity: createdRestaurant.capacity || "",
      openingHours: createdRestaurant.openingHours || "",
      closingHours: createdRestaurant.closingHours || "",
      features: createdRestaurant.features || "",
      specialties: createdRestaurant.specialties || "",
      parking: createdRestaurant.parking || "",
      wifi: createdRestaurant.wifi || "",
      delivery: createdRestaurant.delivery || false,
      takeaway: createdRestaurant.takeaway || false,
      dineIn: createdRestaurant.dineIn || false,
      status: createdRestaurant.status || "Active",
      location: createdRestaurant.location || {},
      createdAt: createdRestaurant.createdAt || null,
      updatedAt: createdRestaurant.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "রেস্টুরেন্ট সফলভাবে যোগ হয়েছে",
        restaurant: formattedRestaurant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}

