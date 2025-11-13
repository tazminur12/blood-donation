import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all notifications
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in notifications API:", JSON.stringify(session?.user, null, 2));

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // If role is not in session, fetch from database
    let userRole = session.user.role;
    if (!userRole) {
      console.log("Role not in session, fetching from database...");
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
        console.log("Role from database:", userRole);
      }
    }

    console.log("Final user role:", userRole);

    // Check if user is admin
    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
          message: `Your current role is "${userRole}". Please contact an admin to change your role.`
        },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const notifications = db.collection("notifications");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit")) || 100;

    // Build query
    const query = {};
    if (type !== "all") {
      query.type = type;
    }
    if (status !== "all") {
      query.read = status === "read";
    }

    // Fetch notifications
    const notificationList = await notifications
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    console.log("Notifications fetched:", notificationList.length);

    const formattedNotifications = notificationList.map((notification) => ({
      id: notification._id.toString(),
      title: notification.title || null,
      message: notification.message || null,
      type: notification.type || "info",
      recipient: notification.recipient || null,
      recipientEmail: notification.recipientEmail || null,
      recipientRole: notification.recipientRole || null,
      read: notification.read || false,
      readAt: notification.readAt || null,
      createdAt: notification.createdAt || null,
      createdBy: notification.createdBy || null,
      priority: notification.priority || "normal",
      actionUrl: notification.actionUrl || null,
    }));

    // Calculate stats
    const allNotifications = await notifications.find({}).toArray();
    const stats = {
      total: allNotifications.length,
      unread: allNotifications.filter(n => !n.read).length,
      read: allNotifications.filter(n => n.read).length,
      byType: {},
    };

    allNotifications.forEach((notification) => {
      const type = notification.type || "info";
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return NextResponse.json({ 
      notifications: formattedNotifications,
      stats: stats,
      total: formattedNotifications.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    
    // If notifications collection doesn't exist, return empty array
    if (error.message?.includes("collection") || error.code === 26) {
      return NextResponse.json({ 
        notifications: [],
        stats: {
          total: 0,
          unread: 0,
          read: 0,
          byType: {},
        },
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

// POST - Create new notification
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // If role is not in session, fetch from database
    let userRole = session.user.role;
    if (!userRole) {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
      }
    }

    // Check if user is admin
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
    const { title, message, type, recipientEmail, recipientRole, priority, actionUrl } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const notifications = db.collection("notifications");

    // Create notification
    const notification = {
      title,
      message,
      type: type || "info",
      recipient: recipientEmail || null,
      recipientEmail: recipientEmail || null,
      recipientRole: recipientRole || "all",
      read: false,
      priority: priority || "normal",
      actionUrl: actionUrl || null,
      createdBy: session.user.email,
      createdAt: new Date(),
    };

    const result = await notifications.insertOne(notification);

    return NextResponse.json(
      { 
        success: true, 
        message: "Notification created successfully",
        notification: {
          id: result.insertedId.toString(),
          ...notification,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { 
        error: "Failed to create notification",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Mark notification as read/unread
export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // If role is not in session, fetch from database
    let userRole = session.user.role;
    if (!userRole) {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
      }
    }

    // Check if user is admin
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

