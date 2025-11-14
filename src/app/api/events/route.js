import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const eventsCollection = db.collection("events");

    const events = await eventsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      title: event.title || "",
      description: event.description || "",
      category: event.category || "",
      location: event.location || "",
      date: event.date || "",
      time: event.time || "",
      organizer: event.organizer || "",
      organizerPhone: event.organizerPhone || "",
      organizerEmail: event.organizerEmail || "",
      organizerWebsite: event.organizerWebsite || "",
      capacity: event.capacity || "",
      entryFee: event.entryFee || "",
      isFree: event.isFree || false,
      targetAudience: event.targetAudience || "",
      highlights: event.highlights || "",
      requirements: event.requirements || "",
      contactInfo: event.contactInfo || "",
      socialMedia: event.socialMedia || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      status: event.status || "Upcoming",
      locationDetails: event.locationDetails || {},
      createdAt: event.createdAt || null,
      updatedAt: event.updatedAt || null,
    }));

    return NextResponse.json(
      {
        success: true,
        events: formattedEvents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
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
      title,
      description,
      category,
      location,
      date,
      time,
      organizer,
      organizerPhone,
      organizerEmail,
      organizerWebsite,
      capacity,
      entryFee,
      isFree,
      targetAudience,
      highlights,
      requirements,
      contactInfo,
      socialMedia,
      status,
      locationDetails,
    } = body;

    // Validation
    if (!title || !category || !location || !date || !organizer) {
      return NextResponse.json(
        { success: false, error: "Title, category, location, date, and organizer are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const eventsCollection = db.collection("events");

    const userEmail = session.user.email;

    const newEvent = {
      title,
      description: description || "",
      category,
      location,
      date,
      time: time || "",
      organizer,
      organizerPhone: organizerPhone || "",
      organizerEmail: organizerEmail || "",
      organizerWebsite: organizerWebsite || "",
      capacity: capacity || "",
      entryFee: entryFee || "",
      isFree: isFree || false,
      targetAudience: targetAudience || "",
      highlights: highlights || "",
      requirements: requirements || "",
      contactInfo: contactInfo || "",
      socialMedia: socialMedia || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      status: status || "Upcoming",
      locationDetails: locationDetails || {
        city: "গোবিন্দগঞ্জ",
        district: "গোবিন্দগঞ্জ",
        division: "রাজশাহী",
      },
      postedBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(newEvent);

    const createdEvent = await eventsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedEvent = {
      id: createdEvent._id.toString(),
      title: createdEvent.title || "",
      description: createdEvent.description || "",
      category: createdEvent.category || "",
      location: createdEvent.location || "",
      date: createdEvent.date || "",
      time: createdEvent.time || "",
      organizer: createdEvent.organizer || "",
      organizerPhone: createdEvent.organizerPhone || "",
      organizerEmail: createdEvent.organizerEmail || "",
      organizerWebsite: createdEvent.organizerWebsite || "",
      capacity: createdEvent.capacity || "",
      entryFee: createdEvent.entryFee || "",
      isFree: createdEvent.isFree || false,
      targetAudience: createdEvent.targetAudience || "",
      highlights: createdEvent.highlights || "",
      requirements: createdEvent.requirements || "",
      contactInfo: createdEvent.contactInfo || "",
      socialMedia: createdEvent.socialMedia || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      status: createdEvent.status || "Upcoming",
      locationDetails: createdEvent.locationDetails || {},
      createdAt: createdEvent.createdAt || null,
      updatedAt: createdEvent.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "ইভেন্ট সফলভাবে যোগ হয়েছে",
        event: formattedEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}

