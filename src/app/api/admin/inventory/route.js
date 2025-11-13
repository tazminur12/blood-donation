import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch blood inventory (admin only)
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

    const donationsCollection = db.collection("donations");
    const requestsCollection = db.collection("bloodRequests");
    const inventoryCollection = db.collection("bloodInventory");
    const inventoryHistoryCollection = db.collection("inventoryHistory");

    // Get current inventory from database (if exists)
    const inventoryDocs = await inventoryCollection.find({}).toArray();
    
    // Initialize inventory object
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const inventory = {};
    
    // Initialize all blood groups
    bloodGroups.forEach(bg => {
      inventory[bg] = 0;
    });

    // Load from database if exists
    inventoryDocs.forEach(doc => {
      if (doc.bloodGroup && inventory.hasOwnProperty(doc.bloodGroup)) {
        inventory[doc.bloodGroup] = doc.units || 0;
      }
    });

    // Calculate from donations (if inventory is empty, calculate from donations)
    const totalInventory = Object.values(inventory).reduce((sum, val) => sum + val, 0);
    if (totalInventory === 0) {
      const donations = await donationsCollection.find({ 
        status: "completed" 
      }).toArray();
      
      donations.forEach(donation => {
        if (donation.bloodGroup && inventory.hasOwnProperty(donation.bloodGroup)) {
          inventory[donation.bloodGroup] = (inventory[donation.bloodGroup] || 0) + (donation.units || 1);
        }
      });

      // Subtract fulfilled requests
      const fulfilledRequests = await requestsCollection.find({ 
        status: "fulfilled" 
      }).toArray();
      
      fulfilledRequests.forEach(request => {
        if (request.bloodGroup && inventory.hasOwnProperty(request.bloodGroup)) {
          inventory[request.bloodGroup] = Math.max(0, (inventory[request.bloodGroup] || 0) - (request.units || 1));
        }
      });
    }

    // Get pending requests by blood group
    const pendingRequests = await requestsCollection.find({
      status: { $in: ["pending", "active"] }
    }).toArray();

    const pendingByBloodGroup = {};
    bloodGroups.forEach(bg => {
      pendingByBloodGroup[bg] = 0;
    });

    pendingRequests.forEach(request => {
      if (request.bloodGroup && pendingByBloodGroup.hasOwnProperty(request.bloodGroup)) {
        pendingByBloodGroup[request.bloodGroup] = (pendingByBloodGroup[request.bloodGroup] || 0) + (request.units || 1);
      }
    });

    // Get recent inventory history
    const recentHistory = await inventoryHistoryCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const formattedHistory = recentHistory.map(entry => ({
      id: entry._id.toString(),
      bloodGroup: entry.bloodGroup || null,
      units: entry.units || 0,
      type: entry.type || "add", // add, remove, adjust
      reason: entry.reason || null,
      performedBy: entry.performedBy || null,
      createdAt: entry.createdAt || null,
    }));

    // Calculate total stats
    const totalUnits = Object.values(inventory).reduce((sum, val) => sum + val, 0);
    const totalPending = Object.values(pendingByBloodGroup).reduce((sum, val) => sum + val, 0);
    const lowStock = Object.entries(inventory).filter(([bg, units]) => units < 10).length;

    return NextResponse.json(
      {
        inventory: inventory,
        pendingByBloodGroup: pendingByBloodGroup,
        history: formattedHistory,
        stats: {
          totalUnits: totalUnits,
          totalPending: totalPending,
          lowStock: lowStock,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// POST - Update inventory (add/remove blood units)
export async function POST(request) {
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
    const { bloodGroup, units, type, reason } = body;

    if (!bloodGroup || !units || !type) {
      return NextResponse.json(
        { error: "Blood group, units, and type are required" },
        { status: 400 }
      );
    }

    const validTypes = ["add", "remove", "adjust"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'add', 'remove', or 'adjust'" },
        { status: 400 }
      );
    }

    if (units <= 0) {
      return NextResponse.json(
        { error: "Units must be greater than 0" },
        { status: 400 }
      );
    }

    const inventoryCollection = db.collection("bloodInventory");
    const inventoryHistoryCollection = db.collection("inventoryHistory");

    // Get current inventory
    const currentInventory = await inventoryCollection.findOne({ bloodGroup });
    const currentUnits = currentInventory?.units || 0;

    let newUnits;
    if (type === "add") {
      newUnits = currentUnits + units;
    } else if (type === "remove") {
      if (currentUnits < units) {
        return NextResponse.json(
          { error: "Insufficient inventory. Available: " + currentUnits },
          { status: 400 }
        );
      }
      newUnits = currentUnits - units;
    } else if (type === "adjust") {
      newUnits = units;
    }

    // Update or insert inventory
    await inventoryCollection.updateOne(
      { bloodGroup },
      {
        $set: {
          bloodGroup,
          units: newUnits,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Add to history
    await inventoryHistoryCollection.insertOne({
      bloodGroup,
      units: type === "adjust" ? newUnits : units,
      type,
      reason: reason || null,
      previousUnits: currentUnits,
      newUnits: newUnits,
      performedBy: session.user.email,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: `Inventory ${type === "add" ? "added" : type === "remove" ? "removed" : "adjusted"} successfully`,
        inventory: {
          bloodGroup,
          units: newUnits,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}

