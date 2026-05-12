import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";

import { prisma } from "../../../lib/prisma";

import { geminiModel } from "../../../lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();

    const message = body.message;

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
        },
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 20,
    });

    const goals = await prisma.goal.findMany({
      where: {
        userId: user.id,
      },
    });

    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const prompt = `
You are Nabungin.AI assistant.

Your personality:
- friendly
- modern
- helpful
- casual but professional
- speak like a smart financial companion
- do not immediately analyze finances unless user asks
- allow casual conversation
- introduce yourself naturally
- keep responses concise and conversational

You already know the user's financial data internally.

User Financial Context:

Income: ${totalIncome}
Expense: ${totalExpense}

Goals:
${goals
  .map(
    (goal) =>
      `${goal.title}:
      ${goal.savedAmount}/${goal.targetAmount}`,
  )
  .join("\n")}

Recent Transactions:
${transactions
  .map((transaction) => `${transaction.category} - ${transaction.amount}`)
  .join("\n")}

Rules:
- If user says hello/introduction, introduce yourself first
- Don't immediately dump financial analysis
- Only discuss finance when relevant
- Keep tone natural
- Use Indonesian language
- Avoid sounding robotic
- Use user's financial data only when useful

User Message:
${message}
`;

    const result = await geminiModel.generateContent(prompt);

    const response = result.response.text();

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "AI failed",
      },
      {
        status: 500,
      },
    );
  }
}
