import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all appointments (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");
    
    const user = await users.findOne({ email: session.user.email });
    const userRole = user?.role || session?.user?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const appointmentsCollection = db.collection("appointments");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, confirmed, cancelled, completed
    const search = searchParams.get("search");

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { donorName: { $regex: search, $options: "i" } },
        { donorEmail: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } },
        { center: { $regex: search, $options: "i" } },
        { purpose: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch appointments
    const appointments = await appointmentsCollection
      .find(filter)
      .sort({ appointmentDate: 1, appointmentTime: 1, createdAt: -1 }) // Sort by date/time ascending
      .toArray();

    // Format appointments
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment._id.toString(),
      donorEmail: appointment.donorEmail || null,
      donorName: appointment.donorName || null,
      donorMobile: appointment.donorMobile || null,
      donorBloodGroup: appointment.donorBloodGroup || null,
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
    const totalAppointments = await appointmentsCollection.countDocuments({});
    const pendingAppointments = await appointmentsCollection.countDocuments({ status: "pending" });
    const confirmedAppointments = await appointmentsCollection.countDocuments({ status: "confirmed" });
    const completedAppointments = await appointmentsCollection.countDocuments({ status: "completed" });
    const cancelledAppointments = await appointmentsCollection.countDocuments({ status: "cancelled" });

    // Get upcoming appointments (today and future)
    const today = new Date().toISOString().split("T")[0];
    const upcomingAppointments = await appointmentsCollection.countDocuments({
      appointmentDate: { $gte: today },
      status: { $in: ["pending", "confirmed"] },
    });

    return NextResponse.json(
      {
        appointments: formattedAppointments,
        stats: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          upcoming: upcomingAppointments,
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

// PUT - Update appointment status (admin only)
export async function PUT(request) {
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
    const users = db.collection("users");
    
    const user = await users.findOne({ email: session.user.email });
    const userRole = user?.role || session?.user?.role;

    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Appointment ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const appointmentsCollection = db.collection("appointments");
    const { ObjectId } = await import("mongodb");

    // Update appointment
    const result = await appointmentsCollection.updateOne(
      { _id: new ObjectId(appointmentId) },
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Get updated appointment
    const updatedAppointment = await appointmentsCollection.findOne({
      _id: new ObjectId(appointmentId),
    });

    // Create notification for donor
    if (updatedAppointment.donorEmail) {
      const notificationsCollection = db.collection("notifications");
      const statusMessages = {
        confirmed: "আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে",
        completed: "আপনার অ্যাপয়েন্টমেন্ট সম্পন্ন হয়েছে",
        cancelled: "আপনার অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে",
      };

      if (statusMessages[status]) {
        await notificationsCollection.insertOne({
          recipientEmail: updatedAppointment.donorEmail,
          type: status === "cancelled" ? "error" : status === "completed" ? "success" : "info",
          title: "অ্যাপয়েন্টমেন্ট আপডেট",
          message: statusMessages[status],
          read: false,
          createdAt: new Date(),
          actionUrl: `/dashboard/donor/appointments`,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment status updated successfully",
        appointment: {
          id: updatedAppointment._id.toString(),
          status: updatedAppointment.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

