import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all blogs
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

    const blogsCollection = db.collection("blogs");

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");
    
    // If ID is provided, return single blog
    if (blogId) {
      try {
        const blog = await blogsCollection.findOne({
          _id: new ObjectId(blogId),
        });

        if (!blog) {
          return NextResponse.json(
            { error: "Blog not found" },
            { status: 404 }
          );
        }

        const formattedBlog = {
          id: blog._id.toString(),
          title: blog.title || "",
          thumbnail: blog.thumbnail || "",
          content: blog.content || "",
          status: blog.status || "draft",
          author: blog.author || "Admin",
          authorEmail: blog.authorEmail || "",
          createdAt: blog.createdAt || blog._id.getTimestamp().toISOString(),
          updatedAt: blog.updatedAt || blog._id.getTimestamp().toISOString(),
          publishedAt: blog.publishedAt || null,
          views: blog.views || 0,
          likes: blog.likes || 0,
        };

        return NextResponse.json({
          blog: formattedBlog,
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
          { error: "Failed to fetch blog", message: error.message },
          { status: 500 }
        );
      }
    }

    const status = searchParams.get("status"); // draft, published, archived
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 100;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await blogsCollection.countDocuments(filter);

    // Format blogs
    const formattedBlogs = blogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title || "",
      thumbnail: blog.thumbnail || "",
      content: blog.content || "",
      status: blog.status || "draft",
      author: blog.author || "Admin",
      authorEmail: blog.authorEmail || "",
      createdAt: blog.createdAt || blog._id.getTimestamp().toISOString(),
      updatedAt: blog.updatedAt || blog._id.getTimestamp().toISOString(),
      publishedAt: blog.publishedAt || null,
      views: blog.views || 0,
      likes: blog.likes || 0,
    }));

    // Calculate stats
    const stats = {
      total: await blogsCollection.countDocuments({}),
      draft: await blogsCollection.countDocuments({ status: "draft" }),
      published: await blogsCollection.countDocuments({ status: "published" }),
      archived: await blogsCollection.countDocuments({ status: "archived" }),
    };

    return NextResponse.json({
      blogs: formattedBlogs,
      stats,
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
      { error: "Failed to fetch blogs", message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new blog
export async function POST(request) {
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

    const body = await request.json();
    const { title, thumbnail, content, status = "published" } = body;

    // Validation
    if (!title || !thumbnail || !content) {
      return NextResponse.json(
        { error: "Title, thumbnail, and content are required" },
        { status: 400 }
      );
    }

    // Validate content length (strip HTML tags)
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (textContent.length < 50) {
      return NextResponse.json(
        { error: "Content must be at least 50 characters long" },
        { status: 400 }
      );
    }

    const blogsCollection = db.collection("blogs");

    const blogData = {
      title: title.trim(),
      thumbnail: thumbnail.trim(),
      content: content.trim(),
      status: status, // draft, published, archived
      author: body.author || session.user.name || "Admin",
      authorEmail: body.authorEmail || session.user.email || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: status === "published" ? new Date() : null,
      views: 0,
      likes: 0,
    };

    const result = await blogsCollection.insertOne(blogData);

    if (result.insertedId) {
      return NextResponse.json(
        {
          message: "Blog created successfully",
          insertedId: result.insertedId.toString(),
          acknowledged: result.acknowledged,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to create blog" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog", message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a blog
export async function PUT(request) {
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

    const body = await request.json();
    const { blogId, title, thumbnail, content, status, author } = body;

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blogsCollection = db.collection("blogs");

    // Check if blog exists
    const existingBlog = await blogsCollection.findOne({
      _id: new ObjectId(blogId),
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail.trim();
    if (content !== undefined) {
      // Validate content length
      const textContent = content.replace(/<[^>]*>/g, "").trim();
      if (textContent.length < 50) {
        return NextResponse.json(
          { error: "Content must be at least 50 characters long" },
          { status: 400 }
        );
      }
      updateData.content = content.trim();
    }
    if (author !== undefined) updateData.author = author.trim();
    if (status !== undefined) {
      updateData.status = status;
      // Set publishedAt if status is being changed to published
      if (status === "published" && existingBlog.status !== "published") {
        updateData.publishedAt = new Date();
      }
    }

    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(blogId) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        message: "Blog updated successfully",
        modifiedCount: result.modifiedCount,
      });
    } else {
      return NextResponse.json(
        { error: "No changes made to blog" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blogsCollection = db.collection("blogs");

    const result = await blogsCollection.deleteOne({
      _id: new ObjectId(blogId),
    });

    if (result.deletedCount > 0) {
      return NextResponse.json({
        message: "Blog deleted successfully",
        deletedCount: result.deletedCount,
      });
    } else {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog", message: error.message },
      { status: 500 }
    );
  }
}

