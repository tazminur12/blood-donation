import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch user notifications
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
    const notifications = db.collection("notifications");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // Build query - get notifications for this user
    const userEmail = session.user.email;
    const userRole = session.user.role || "user";
    
    const query = {
      $or: [
        { recipientEmail: userEmail },
        { recipientRole: userRole },
        { recipientRole: "all" },
      ],
    };

    if (unreadOnly) {
      query.read = false;
    }

    // Fetch notifications
    const notificationList = await notifications
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const formattedNotifications = notificationList.map((notification) => ({
      id: notification._id.toString(),
      title: notification.title || null,
      message: notification.message || null,
      type: notification.type || "info",
      read: notification.read || false,
      readAt: notification.readAt || null,
      createdAt: notification.createdAt || null,
      priority: notification.priority || "normal",
      actionUrl: notification.actionUrl || null,
    }));

    // Count unread notifications
    const unreadCount = await notifications.countDocuments({
      ...query,
      read: false,
    });

    return NextResponse.json({ 
      notifications: formattedNotifications,
      unreadCount: unreadCount,
      total: formattedNotifications.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    
    // If notifications collection doesn't exist, return empty array
    if (error.message?.includes("collection") || error.code === 26) {
      return NextResponse.json({ 
        notifications: [],
        unreadCount: 0,
        total: 0 
      }, { status: 200 });
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch notifications",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Mark notification as read
export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, read } = body;

    if (!notificationId || typeof read !== "boolean") {
      return NextResponse.json(
        { error: "Notification ID and read status are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const notifications = db.collection("notifications");

    // Verify the notification belongs to this user
    const userEmail = session.user.email;
    const userRole = session.user.role || "user";
    
    const notification = await notifications.findOne({
      _id: new ObjectId(notificationId),
      $or: [
        { recipientEmail: userEmail },
        { recipientRole: userRole },
        { recipientRole: "all" },
      ],
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update notification
    const result = await notifications.updateOne(
      { _id: new ObjectId(notificationId) },
      {
        $set: {
          read: read,
          readAt: read ? new Date() : null,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Notification marked as ${read ? "read" : "unread"}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { 
        error: "Failed to update notification",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

