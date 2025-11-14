import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const eventsCollection = db.collection("events");

    const event = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const formattedEvent = {
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
    };

    return NextResponse.json(
      {
        success: true,
        event: formattedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch event" },
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

    // Check if event exists
    const existingEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const updateData = {
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
      updatedAt: new Date(),
    };

    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedEvent = {
      id: updatedEvent._id.toString(),
      title: updatedEvent.title || "",
      description: updatedEvent.description || "",
      category: updatedEvent.category || "",
      location: updatedEvent.location || "",
      date: updatedEvent.date || "",
      time: updatedEvent.time || "",
      organizer: updatedEvent.organizer || "",
      organizerPhone: updatedEvent.organizerPhone || "",
      organizerEmail: updatedEvent.organizerEmail || "",
      organizerWebsite: updatedEvent.organizerWebsite || "",
      capacity: updatedEvent.capacity || "",
      entryFee: updatedEvent.entryFee || "",
      isFree: updatedEvent.isFree || false,
      targetAudience: updatedEvent.targetAudience || "",
      highlights: updatedEvent.highlights || "",
      requirements: updatedEvent.requirements || "",
      contactInfo: updatedEvent.contactInfo || "",
      socialMedia: updatedEvent.socialMedia || {
        facebook: "",
        instagram: "",
        twitter: "",
      },
      status: updatedEvent.status || "Upcoming",
      locationDetails: updatedEvent.locationDetails || {},
      createdAt: updatedEvent.createdAt || null,
      updatedAt: updatedEvent.updatedAt || null,
    };

    return NextResponse.json(
      {
        success: true,
        message: "ইভেন্ট সফলভাবে আপডেট করা হয়েছে",
        event: formattedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event" },
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
    const eventsCollection = db.collection("events");

    const result = await eventsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "ইভেন্ট সফলভাবে মুছে ফেলা হয়েছে",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

