import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Middleware to protect API routes with authentication
 */
export async function withAuth(
  handler: (req: Request, context?: any) => Promise<NextResponse>,
  allowedRoles?: string[]
) {
  return async (req: Request, context?: any) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
        return NextResponse.json(
          { error: "Unauthorized - Please sign in" },
          { status: 401 }
        );
      }

      // Check role permissions if specified
      if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return NextResponse.json(
          { error: "Forbidden - Insufficient permissions" },
          { status: 403 }
        );
      }

      // Add user to request for convenience
      (req as any).user = session.user;

      return handler(req, context);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware to allow only admins
 */
export function adminOnly(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return withAuth(handler, ["admin"]);
}

/**
 * Middleware to allow only professionals and admins
 */
export function professionalOnly(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return withAuth(handler, ["professional", "admin"]);
}

/**
 * Middleware to allow only clients and admins
 */
export function clientOnly(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return withAuth(handler, ["client", "admin"]);
}
