import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (published !== null) {
      query.published = published === "true";
    } else {
      // By default, show only published posts for non-admin users
      const session = await getServerSession(authOptions);
      if (session?.user?.role !== "admin") {
        query.published = true;
      }
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error(
      "Get blogs error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const data = await req.json();

    const blog = new Blog(data);
    await blog.save();

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    console.error(
      "Create blog error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      {
        error: "Failed to create blog",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}
