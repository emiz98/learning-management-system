import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import * as z from "zod";
import { HttpStatusCode } from "axios";
import { IUserRole } from "@/interfaces/IUserRole";
import { UserUpdateSchema } from "@/lib/zod_schemas";

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(30),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  role: z.enum([IUserRole.ADMIN, IUserRole.USER]),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, role } = userSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: HttpStatusCode.Conflict }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        { status: HttpStatusCode.Conflict }
      );
    }

    const hashedPassword = await hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      { user, message: "User created successfully" },
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
  const { username, email } = UserUpdateSchema.parse(body);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    await db.user.update({
      where: { id: Number(userId) },
      data: {
        email,
        username,
      },
    });

    return NextResponse.json(
      { message: "User updated successfully" },
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
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  const role = searchParams.get("role");

  if (userId) {
    try {
      const user = await db.user.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: HttpStatusCode.NotFound }
        );
      }

      return NextResponse.json({ user: user }, { status: HttpStatusCode.Ok });
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  } else if (role) {
    try {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          enrollments: true,
        },
        where: {
          role: role as IUserRole,
        },
      });
      return NextResponse.json({ users: users }, { status: HttpStatusCode.Ok });
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: HttpStatusCode.InternalServerError }
      );
    }
  } else {
    try {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });
      return NextResponse.json({ users: users }, { status: HttpStatusCode.Ok });
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
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: HttpStatusCode.BadRequest }
    );
  }

  try {
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    await db.user.delete({
      where: { id: Number(userId) },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
