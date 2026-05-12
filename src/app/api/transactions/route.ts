import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "../../lib/auth";

import { prisma } from "../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(
      authOptions
    );

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const transaction =
      await prisma.transaction.create({
        data: {
          type: body.type,

          category: body.category,

          amount: Number(body.amount),

          description: body.description,

          userId: user.id,
        },
      });

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}