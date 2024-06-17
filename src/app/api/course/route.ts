import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { CourseSchema } from "@/lib/zod_schemas";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = CourseSchema.parse(body);

    const existingCourseByTitle = await db.course.findFirst({
      where: { title: title },
    });
    if (existingCourseByTitle) {
      return NextResponse.json(
        { user: null, message: "Course with this title already exists" },
        { status: HttpStatusCode.Conflict }
      );
    }

    const course = await db.course.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      { course, message: "Course created successfully" },
      { status: HttpStatusCode.Created }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { title, description } = CourseSchema.parse(body);
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("id");

  if (!courseId) {
    return NextResponse.json(
      { message: "Course id is required" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  try {
    const course = await db.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    await db.course.update({
      where: { id: Number(courseId) },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      { message: "Course updated successfully" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("id");
  const groupBy = searchParams.get("groupBy");

  if (courseId) {
    try {
      const course = await db.course.findUnique({
        where: { id: Number(courseId) },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: HttpStatusCode.NotFound }
        );
      }

      return NextResponse.json(
        { course: course },
        { status: HttpStatusCode.Ok }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  } else if (groupBy) {
    const user = await db.user.findUnique({
      where: { email: session?.user.email! },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const enrolledCourses = await db.enrollment.findMany({
      where: { userId: Number(user?.id) },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const enrolledCourseIds = enrolledCourses.map(
      (enrollment) => enrollment.course.id
    );

    const notEnrolledCourses = await db.course.findMany({
      where: {
        id: {
          notIn: enrolledCourseIds,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        enrolledCourses: enrolledCourses.map((enrollment) => enrollment.course),
        notEnrolledCourses: notEnrolledCourses,
      },
      { status: HttpStatusCode.Ok }
    );
  } else {
    try {
      const courses = await db.course.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          enrollments: true,
          createdAt: true,
        },
      });
      return NextResponse.json(
        { courses: courses },
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
  const courseId = searchParams.get("id");

  if (!courseId) {
    return NextResponse.json(
      { message: "Course id is required" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  try {
    const course = await db.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    await db.course.delete({
      where: { id: Number(courseId) },
    });

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
