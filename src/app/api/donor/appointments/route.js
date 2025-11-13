import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch appointments for the logged-in donor
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const appointmentsCollection = db.collection("appointments");

    const userEmail = session.user.email;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, confirmed, cancelled, completed

    // Build filter
    const filter = { donorEmail: userEmail };

    if (status && status !== "all") {
      filter.status = status;
    }

    // Fetch appointments
    const appointments = await appointmentsCollection
      .find(filter)
      .sort({ appointmentDate: 1, createdAt: -1 }) // Sort by appointment date ascending
      .toArray();

    // Format appointments
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment._id.toString(),
      hospital: appointment.hospital || null,
      center: appointment.center || null,
      appointmentDate: appointment.appointmentDate || null,
      appointmentTime: appointment.appointmentTime || null,
      purpose: appointment.purpose || null,
      notes: appointment.notes || null,
      status: appointment.status || "pending",
      createdAt: appointment.createdAt || null,
      updatedAt: appointment.updatedAt || null,
    }));

    // Get stats
    const totalAppointments = await appointmentsCollection.countDocuments({ donorEmail: userEmail });
    const pendingAppointments = await appointmentsCollection.countDocuments({ 
      donorEmail: userEmail,
      status: "pending" 
    });
    const confirmedAppointments = await appointmentsCollection.countDocuments({ 
      donorEmail: userEmail,
      status: "confirmed" 
    });
    const completedAppointments = await appointmentsCollection.countDocuments({ 
      donorEmail: userEmail,
      status: "completed" 
    });

    return NextResponse.json(
      {
        appointments: formattedAppointments,
        stats: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST - Create a new appointment
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      hospital,
      center,
      appointmentDate,
      appointmentTime,
      purpose,
      notes,
    } = body;

    // Validation
    if (!hospital || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "Hospital, appointment date, and time are required" },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime < new Date()) {
      return NextResponse.json(
        { error: "Appointment date and time cannot be in the past" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const appointmentsCollection = db.collection("appointments");
    const users = db.collection("users");

    const userEmail = session.user.email;

    // Get user info
    const user = await users.findOne(
      { email: userEmail },
      { projection: { name: 1, mobile: 1, bloodGroup: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check for conflicting appointments (same date and time)
    const conflictingAppointment = await appointmentsCollection.findOne({
      donorEmail: userEmail,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: "You already have an appointment at this date and time" },
        { status: 400 }
      );
    }

    // Create appointment
    const newAppointment = {
      donorEmail: userEmail,
      donorName: user.name || null,
      donorMobile: user.mobile || null,
      donorBloodGroup: user.bloodGroup || null,
      hospital: hospital,
      center: center || null,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      purpose: purpose || "regular",
      notes: notes || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await appointmentsCollection.insertOne(newAppointment);

    // Fetch created appointment
    const createdAppointment = await appointmentsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedAppointment = {
      id: createdAppointment._id.toString(),
      hospital: createdAppointment.hospital || null,
      center: createdAppointment.center || null,
      appointmentDate: createdAppointment.appointmentDate || null,
      appointmentTime: createdAppointment.appointmentTime || null,
      purpose: createdAppointment.purpose || null,
      notes: createdAppointment.notes || null,
      status: createdAppointment.status || "pending",
      createdAt: createdAppointment.createdAt || null,
      updatedAt: createdAppointment.updatedAt || null,
    };

    // Create notification for admin (optional)
    const notificationsCollection = db.collection("notifications");
    await notificationsCollection.insertOne({
      recipientRole: "admin",
      type: "info",
      title: "নতুন অ্যাপয়েন্টমেন্ট",
      message: `${user.name || "একজন রক্তদাতা"} একটি নতুন অ্যাপয়েন্টমেন্ট বুক করেছেন।`,
      read: false,
      createdAt: new Date(),
      actionUrl: `/dashboard/admin/appointments`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully",
        appointment: formattedAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

