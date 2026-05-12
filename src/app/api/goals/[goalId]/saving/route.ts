import { NextResponse } from "next/server";

import { prisma } from "../../../../lib/prisma";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      goalId: string;
    }>;
  }
) {
  try {
    const { goalId } = await context.params;

    const body = await req.json();

    const amount = Number(body.amount);

    const saving = await prisma.saving.create({
      data: {
        amount,
        goalId,
      },
    });

    await prisma.goal.update({
      where: {
        id: goalId,
      },

      data: {
        savedAmount: {
          increment: amount,
        },
      },
    });

    return NextResponse.json(saving);
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