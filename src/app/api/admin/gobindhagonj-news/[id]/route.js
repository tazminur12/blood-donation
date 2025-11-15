import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.DB_NAME || "blood-donation";

// GET - Fetch single Gobindhagonj news
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid news ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const newsCollection = db.collection("gobindhagonjNews");

    const news = await newsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    const formattedNews = {
      id: news._id.toString(),
      title: news.title || "",
      description: news.description || "",
      category: news.category || "",
      publishDate: news.publishDate || null,
      imageUrl: news.imageUrl || "",
      link: news.link || "",
      isActive: news.isActive !== undefined ? news.isActive : true,
      createdAt: news.createdAt || null,
      updatedAt: news.updatedAt || null,
      createdBy: news.createdBy || "",
    };

    return NextResponse.json(
      { news: formattedNews },
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

// PUT - Update Gobindhagonj news
export async function PUT(request, { params }) {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid news ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, category, publishDate, imageUrl, link, isActive } = body;

    const newsCollection = db.collection("gobindhagonjNews");

    // Check if news exists
    const news = await newsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    // Update news
    const updateData = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (publishDate !== undefined) updateData.publishDate = publishDate ? new Date(publishDate) : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (link !== undefined) updateData.link = link;
    if (isActive !== undefined) updateData.isActive = isActive;

    await newsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Fetch updated news
    const updatedNews = await newsCollection.findOne({
      _id: new ObjectId(id),
    });

    const formattedNews = {
      id: updatedNews._id.toString(),
      title: updatedNews.title || "",
      description: updatedNews.description || "",
      category: updatedNews.category || "",
      publishDate: updatedNews.publishDate || null,
      imageUrl: updatedNews.imageUrl || "",
      link: updatedNews.link || "",
      isActive: updatedNews.isActive !== undefined ? updatedNews.isActive : true,
      createdAt: updatedNews.createdAt || null,
      updatedAt: updatedNews.updatedAt || null,
      createdBy: updatedNews.createdBy || "",
    };

    return NextResponse.json(
      {
        message: "News updated successfully",
        news: formattedNews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

