import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { EnrollmentSchema } from "@/lib/zod_schemas";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { courseId } = EnrollmentSchema.parse(body);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    const existingEnrollment = await db.enrollment.findFirst({
      where: { courseId: Number(courseId), userId: Number(user?.id) },
    });
    if (existingEnrollment) {
      return NextResponse.json(
        {
          message:
            "Enrollment with this user with the selected course already exists",
        },
        { status: HttpStatusCode.Conflict }
      );
    }
    const enrollment = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return NextResponse.json(
      { enrollment, message: "Enrollment created successfully" },
      { status: HttpStatusCode.Created }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const userId = searchParams.get("userId");

  if (courseId) {
    try {
      const enrollments = await db.enrollment.findMany({
        where: { courseId: Number(courseId) },
        select: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });

      return NextResponse.json(
        { enrollments: enrollments },
        { status: HttpStatusCode.Ok }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  }
  if (userId) {
    try {
      const enrollments = await db.enrollment.findMany({
        where: { userId: Number(userId) },
        select: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      });

      return NextResponse.json(
        { enrollments: enrollments },
        { status: HttpStatusCode.Ok }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  } else {
    try {
      const enrollments = await db.enrollment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });
      return NextResponse.json(
        { enrollments: enrollments },
        { status: HttpStatusCode.Ok }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  if (!courseId) {
    return NextResponse.json(
      { message: "Course id is required" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  try {
    await db.enrollment.deleteMany({
      where: { userId: Number(userId), courseId: Number(courseId) },
    });

    return NextResponse.json(
      { message: "Enrollment deleted successfully" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
