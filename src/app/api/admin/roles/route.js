import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all users with roles
export async function GET(request) {
  try {
    // Get session - Next.js 13+ App Router way
    const session = await getServerSession();
    
    console.log("Session in roles API:", JSON.stringify(session?.user, null, 2));

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
    const users = db.collection("users");

    // Get total count first
    const totalCount = await users.countDocuments({});
    console.log("Total users in database:", totalCount);

    const userList = await users
      .find({})
      .project({
        password: 0, // Exclude password
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("Users fetched:", userList.length);

    const formattedUsers = userList.map((user) => ({
      id: user._id.toString(),
      name: user.name || null,
      email: user.email || null,
      mobile: user.mobile || null,
      image: user.image || null,
      bloodGroup: user.bloodGroup || null,
      division: user.division || null,
      district: user.district || null,
      upazila: user.upazila || null,
      role: user.role || "user",
      createdAt: user.createdAt || null,
    }));

    return NextResponse.json({ 
      users: formattedUsers,
      total: formattedUsers.length 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch users",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update user role
export async function PUT(request) {
  try {
    const session = await getServerSession();
    
    console.log("PUT - Session:", JSON.stringify(session?.user, null, 2));

    // Check if user is logged in
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Get user role from session or database
    let userRole = session.user.role;
    if (!userRole || userRole !== "admin") {
      console.log("Role not admin in session, fetching from database...");
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const users = db.collection("users");
      
      const dbUser = await users.findOne({ email: session.user.email });
      if (dbUser) {
        userRole = dbUser.role || "donor";
        console.log("Role from database:", userRole);
      } else {
        return NextResponse.json(
          { error: "User not found in database" },
          { status: 404 }
        );
      }
    }

    console.log("Final user role for PUT:", userRole);

    // Check if user is admin
    if (userRole !== "admin") {
      return NextResponse.json(
        { 
          error: "Unauthorized - Admin access required",
          currentRole: userRole,
          message: `Your current role is "${userRole}". Only admins can change roles.`
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["admin", "donor", "volunteer", "user"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of: admin, donor, volunteer, user" },
        { status: 400 }
      );
    }

    // Prevent admin from removing their own admin role
    if (session.user.id === userId && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch (error) {
      console.error("Invalid ObjectId:", userId, error);
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    // Check if user exists first
    const existingUser = await users.findOne({ _id: objectId });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user role
    const result = await users.updateOne(
      { _id: objectId },
      {
        $set: {
          role: role,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found or could not be updated" },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Role is already set to this value",
          warning: "No changes were made"
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Role updated successfully",
        updatedUser: {
          id: userId,
          email: existingUser.email,
          name: existingUser.name,
          newRole: role,
          oldRole: existingUser.role || "donor"
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { 
        error: "Failed to update role",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

