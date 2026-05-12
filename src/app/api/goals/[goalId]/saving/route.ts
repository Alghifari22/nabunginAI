import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goalId } = await context.params;
    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Verify goal belongs to the authenticated user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId: user.id },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Atomic operation: create saving + update goal in one transaction
    const [saving] = await prisma.$transaction([
      prisma.saving.create({
        data: { amount, goalId },
      }),
      prisma.goal.update({
        where: { id: goalId },
        data: { savedAmount: { increment: amount } },
      }),
    ]);

    return NextResponse.json(saving);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}