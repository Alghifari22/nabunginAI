import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

async function getAuthenticatedUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// POST — create goal
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, targetAmount, dailyTarget } = body;

    if (!title || !targetAmount || !dailyTarget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await getAuthenticatedUser(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const goal = await prisma.goal.create({
      data: { title, targetAmount, dailyTarget, userId: user.id },
    });

    return NextResponse.json(goal);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — edit goal
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthenticatedUser(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { id, title, targetAmount, dailyTarget } = body;

    if (!id) return NextResponse.json({ error: "Goal ID required" }, { status: 400 });

    const existing = await prisma.goal.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(targetAmount !== undefined && { targetAmount: Number(targetAmount) }),
        ...(dailyTarget !== undefined && { dailyTarget: Number(dailyTarget) }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete goal (cascades savings)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthenticatedUser(session.user.email);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Goal ID required" }, { status: 400 });

    const existing = await prisma.goal.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ error: "Goal not found" }, { status: 404 });

    // Delete savings first, then goal
    await prisma.$transaction([
      prisma.saving.deleteMany({ where: { goalId: id } }),
      prisma.goal.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}