import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch all news (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const newspaper = searchParams.get("newspaper") || "";

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const newsCollection = db.collection("news");

    // Build filter - only show active news
    const filter = {
      isActive: true,
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { newspaperName: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (newspaper) {
      filter.newspaperName = newspaper;
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
      createdAt: item.createdAt || null,
    }));

    // Get total count
    const totalCount = await newsCollection.countDocuments(filter);

    // Get categories and newspapers for filter
    const categories = await newsCollection.distinct("category", filter);
    const newspapers = await newsCollection.distinct("newspaperName", filter);

    return NextResponse.json(
      {
        news: formattedNews,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount,
        },
        categories,
        newspapers,
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

