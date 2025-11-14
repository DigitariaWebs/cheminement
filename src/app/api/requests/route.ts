import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Request from "@/models/Request";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: any = {};

    // Filter by user role
    if (session.user.role === "client") {
      query.patientId = session.user.id;
    } else if (session.user.role === "professional") {
      query.assignedProfessional = session.user.id;
    }
    // Admin can see all requests

    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate("patientId", "firstName lastName email phone")
      .populate("assignedProfessional", "firstName lastName email")
      .sort({ requestDate: -1 });

    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Get requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const data = await req.json();

    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      data.patientId = session.user.id;
    }

    const request = new Request(data);
    await request.save();

    return NextResponse.json(request, { status: 201 });
  } catch (error: any) {
    console.error("Create request error:", error);
    return NextResponse.json(
      { error: "Failed to create request", details: error.message },
      { status: 500 }
    );
  }
}
