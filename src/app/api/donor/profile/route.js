import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

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
    const users = db.collection("users");

    // Get user's email
    const userEmail = session.user.email;

    // Fetch user profile
    const user = await users.findOne(
      { email: userEmail },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Format user data
    const profile = {
      id: user._id.toString(),
      name: user.name || null,
      email: user.email || null,
      mobile: user.mobile || null,
      image: user.image || null,
      bloodGroup: user.bloodGroup || null,
      division: user.division || null,
      district: user.district || null,
      upazila: user.upazila || null,
      role: user.role || "donor",
      createdAt: user.createdAt || null,
      updatedAt: user.updatedAt || null,
      lastDonation: user.lastDonation || null,
      totalDonations: user.totalDonations || 0,
      isAvailable: user.isAvailable !== false, // Default to true
      lastLogin: user.lastLogin || null,
      badges: user.badges || [],
    };

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update donor profile
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
    const { name, mobile, image, bloodGroup, division, district, upazila, isAvailable, lastDonation } = body;

    // Validate that user can only update their own profile
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    const userEmail = session.user.email;

    // Build update object with only allowed fields
    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (image !== undefined) updateData.image = image;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (division !== undefined) updateData.division = division;
    if (district !== undefined) updateData.district = district;
    if (upazila !== undefined) updateData.upazila = upazila;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (lastDonation !== undefined) {
      updateData.lastDonation = lastDonation ? new Date(lastDonation) : null;
    }

    // Update user profile
    const result = await users.updateOne(
      { email: userEmail },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch updated profile
    const updatedUser = await users.findOne(
      { email: userEmail },
      { projection: { password: 0 } }
    );

    const profile = {
      id: updatedUser._id.toString(),
      name: updatedUser.name || null,
      email: updatedUser.email || null,
      mobile: updatedUser.mobile || null,
      image: updatedUser.image || null,
      bloodGroup: updatedUser.bloodGroup || null,
      division: updatedUser.division || null,
      district: updatedUser.district || null,
      upazila: updatedUser.upazila || null,
      role: updatedUser.role || "donor",
      createdAt: updatedUser.createdAt || null,
      updatedAt: updatedUser.updatedAt || null,
      lastDonation: updatedUser.lastDonation || null,
      totalDonations: updatedUser.totalDonations || 0,
      isAvailable: updatedUser.isAvailable !== false,
      lastLogin: updatedUser.lastLogin || null,
      badges: updatedUser.badges || [],
    };

    return NextResponse.json(
      { 
        success: true,
        message: "Profile updated successfully",
        profile 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating donor profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

