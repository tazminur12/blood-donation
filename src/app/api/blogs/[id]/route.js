import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch a single published blog by ID (public access)
export async function GET(request, { params }) {
  try {
    // Handle async params in Next.js 15+ or sync params in Next.js 16
    let id;
    if (params && typeof params.then === 'function') {
      // Params is a Promise (Next.js 15+)
      const resolvedParams = await params;
      id = resolvedParams.id;
    } else {
      // Params is an object (Next.js 16)
      id = params?.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const blogsCollection = db.collection("blogs");

    // Find blog - must be published
    let blog;
    try {
      blog = await blogsCollection.findOne({
        _id: new ObjectId(id),
        status: "published",
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { success: false, error: "Invalid blog ID or database error" },
        { status: 400 }
      );
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "ব্লগ পাওয়া যায়নি বা এখনও প্রকাশিত হয়নি" },
        { status: 404 }
      );
    }

    // Increment views
    await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    // Format blog
    const formattedBlog = {
      id: blog._id.toString(),
      title: blog.title || "",
      thumbnail: blog.thumbnail || "",
      content: blog.content || "",
      status: blog.status || "published",
      author: blog.author || "Admin",
      authorEmail: blog.authorEmail || "",
      createdAt: blog.createdAt || blog._id.getTimestamp().toISOString(),
      updatedAt: blog.updatedAt || blog._id.getTimestamp().toISOString(),
      publishedAt: blog.publishedAt || blog.createdAt || blog._id.getTimestamp().toISOString(),
      views: (blog.views || 0) + 1, // Incremented view count
      likes: blog.likes || 0,
    };

    return NextResponse.json({
      success: true,
      blog: formattedBlog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog", message: error.message },
      { status: 500 }
    );
  }
}

