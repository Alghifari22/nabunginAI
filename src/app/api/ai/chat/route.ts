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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    const body = await req.json();

    const message = body.message;

    await prisma.aIMessage.create({
      data: {
        role: "user",

        content: message,

        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    const previousMessages = await prisma.aIMessage.findMany({
      where: {
        userId: user?.id,
      },

      orderBy: {
        createdAt: "asc",
      },

      take: 10,
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

    const memoryContext = previousMessages
      .map(
        (message: { role: string; content: string }) =>
          `${message.role}: ${message.content}`,
      )
      .join("\n");

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
Conversation History: ${memoryContext}
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
- You already know the user's financial data
- Do not ask for financial information that already exists
- Use the available financial data immediately
- Give calculations and estimations directly when possible
- Be proactive and analytical
- Avoid unnecessary follow-up questions

User Message:
${message}
`;

    const result = await geminiModel.generateContent(prompt);

    const response = result.response.text();
    await prisma.aIMessage.create({
      data: {
        role: "assistant",
        content: response,
        user: {
            connect: {
                id: user.id,
            },
        },
      },
    });

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
