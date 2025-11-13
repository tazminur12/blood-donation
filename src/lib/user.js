import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

const DB_NAME = process.env.DB_NAME || "blood-donation";

export async function createUser({
  name,
  email,
  mobile,
  password,
  photoURL,
  bloodGroup,
  division,
  district,
  upazila,
  role,
}) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password only if provided (for OAuth users, password might be empty)
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    // Create user
    const result = await users.insertOne({
      name,
      email,
      mobile: mobile || null,
      password: hashedPassword,
      image: photoURL || null,
      bloodGroup: bloodGroup || null,
      division: division || null,
      district: district || null,
      upazila: upazila || null,
      role: role || "donor", // Default role is "donor"
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: result.insertedId.toString(),
      name,
      email,
      mobile: mobile || null,
      image: photoURL || null,
      bloodGroup: bloodGroup || null,
      division: division || null,
      district: district || null,
      upazila: upazila || null,
      role: role || "donor",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile || null,
      password: user.password,
      image: user.image || null,
      bloodGroup: user.bloodGroup || null,
      division: user.division || null,
      district: user.district || null,
      upazila: user.upazila || null,
      role: user.role || "donor",
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}

export async function verifyPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}

export async function updateUser(email, updates) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    const result = await users.updateOne(
      { email },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

