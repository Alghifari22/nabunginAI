import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { geminiModel } from "../../../lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const message: string = body.message;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: { role: "user", content: message, userId: user.id },
    });

    // Fetch context in parallel
    const [previousMessages, transactions, goals] = await Promise.all([
      prisma.aIMessage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.goal.findMany({ where: { userId: user.id } }),
    ]);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    const memoryContext = previousMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
You are Nabungin.AI assistant.

Your personality:
- friendly, modern, helpful
- casual but professional
- speak like a smart financial companion
- do not immediately analyze finances unless user asks
- allow casual conversation
- keep responses concise and conversational

User Financial Context:
Income: ${totalIncome}
Expense: ${totalExpense}
Balance: ${totalIncome - totalExpense}

Goals:
${goals.map((g) => `${g.title}: ${g.savedAmount}/${g.targetAmount}`).join("\n")}

Recent Transactions:
${transactions.map((t) => `${t.category} - ${t.amount} (${t.type})`).join("\n")}

Conversation History:
${memoryContext}

Rules:
- If user says hello, introduce yourself first
- Only discuss finance when relevant
- Use Indonesian language
- Use user's financial data only when useful
- Give calculations and estimations directly when possible
- Avoid unnecessary follow-up questions

User Message: ${message}
`;

    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text();

    // Save assistant response
    await prisma.aIMessage.create({
      data: { role: "assistant", content: response, userId: user.id },
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("[AI Chat Error]", error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}
