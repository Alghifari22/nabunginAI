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

    const {
      title,
      targetAmount,
      dailyTarget,
    } = body;

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

    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount,
        dailyTarget,
        userId: user.id,
      },
    });

    return NextResponse.json(goal);
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