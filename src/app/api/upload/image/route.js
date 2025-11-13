import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY || process.env.IMGBB_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "ImgBB API key is not configured" },
        { status: 500 }
      );
    }

    // Convert file to base64 for ImgBB API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Upload to ImgBB using FormData with base64 image
    const imgbbFormData = new FormData();
    imgbbFormData.append("key", apiKey);
    imgbbFormData.append("image", base64Image);

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    const imgbbData = await imgbbResponse.json();

    if (!imgbbResponse.ok || !imgbbData.success) {
      console.error("ImgBB API error:", imgbbData);
      return NextResponse.json(
        {
          success: false,
          error: imgbbData.error?.message || "Failed to upload image to ImgBB",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        imageUrl: imgbbData.data.url,
        deleteUrl: imgbbData.data.delete_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

