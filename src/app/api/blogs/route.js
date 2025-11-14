import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch published blogs (public access)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const blogsCollection = db.collection("blogs");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 12;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    // Build filter - only published blogs
    const filter = {
      status: "published",
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch blogs
    const blogs = await blogsCollection
      .find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await blogsCollection.countDocuments(filter);

    // Format blogs (exclude full content for listing)
    const formattedBlogs = blogs.map((blog) => {
      const content = blog.content || "";
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "");

      return {
        id: blog._id.toString(),
        title: blog.title || "",
        thumbnail: blog.thumbnail || "",
        excerpt: excerpt,
        status: blog.status || "published",
        author: blog.author || "Admin",
        createdAt: blog.createdAt || blog._id.getTimestamp().toISOString(),
        publishedAt: blog.publishedAt || blog.createdAt || blog._id.getTimestamp().toISOString(),
        views: blog.views || 0,
        likes: blog.likes || 0,
      };
    });

    return NextResponse.json({
      success: true,
      blogs: formattedBlogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs", message: error.message },
      { status: 500 }
    );
  }
}

