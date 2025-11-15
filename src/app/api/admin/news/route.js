import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all news
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
    
    const user = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";

    const newsCollection = db.collection("news");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { newspaperName: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch news
    const news = await newsCollection
      .find(filter)
      .sort({ publicationDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Format news
    const formattedNews = news.map((item) => ({
      id: item._id.toString(),
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      newspaperName: item.newspaperName || "",
      publicationDate: item.publicationDate || null,
      imageUrl: item.imageUrl || "",
      link: item.link || "",
      isActive: item.isActive !== undefined ? item.isActive : true,
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt || null,
      createdBy: item.createdBy || session.user.email,
    }));

    // Get total count
    const totalCount = await newsCollection.countDocuments(filter);

    // Get stats
    const stats = {
      total: totalCount,
      active: await newsCollection.countDocuments({ ...filter, isActive: true }),
      byNewspaper: {},
    };

    const newspapers = await newsCollection.distinct("newspaperName");
    for (const newspaper of newspapers) {
      stats.byNewspaper[newspaper] = await newsCollection.countDocuments({
        ...filter,
        newspaperName: newspaper,
      });
    }

    return NextResponse.json(
      {
        news: formattedNews,
        stats,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// POST - Create new news
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
    
    const user = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, newspaperName, publicationDate, imageUrl, link, isActive } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newsCollection = db.collection("news");
    const userEmail = session.user.email;

    const newsData = {
      title,
      description: description || "",
      category: category || "",
      newspaperName: newspaperName || "",
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
      imageUrl: imageUrl || "",
      link: link || "",
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await newsCollection.insertOne(newsData);

    // Fetch created news
    const createdNews = await newsCollection.findOne({
      _id: result.insertedId,
    });

    const formattedNews = {
      id: createdNews._id.toString(),
      title: createdNews.title || "",
      description: createdNews.description || "",
      category: createdNews.category || "",
      newspaperName: createdNews.newspaperName || "",
      publicationDate: createdNews.publicationDate || null,
      imageUrl: createdNews.imageUrl || "",
      link: createdNews.link || "",
      isActive: createdNews.isActive !== undefined ? createdNews.isActive : true,
      createdAt: createdNews.createdAt || null,
      updatedAt: createdNews.updatedAt || null,
      createdBy: createdNews.createdBy || userEmail,
    };

    return NextResponse.json(
      {
        message: "News created successfully",
        news: formattedNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}

// DELETE - Delete news
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
    
    const user = await users.findOne(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get("newsId");

    if (!newsId) {
      return NextResponse.json(
        { error: "News ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(newsId)) {
      return NextResponse.json(
        { error: "Invalid news ID" },
        { status: 400 }
      );
    }

    const newsCollection = db.collection("news");

    // Check if news exists
    const news = await newsCollection.findOne({
      _id: new ObjectId(newsId),
    });

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    // Delete news
    await newsCollection.deleteOne({
      _id: new ObjectId(newsId),
    });

    return NextResponse.json(
      {
        message: "News deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}

