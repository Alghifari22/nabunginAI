"use client";

import { useState } from "react";

import axios from "axios";

import { Bot, Send, Sparkles } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";

  content: string;
};

export function AIChatSheet() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");

    try {
      setLoading(true);

      const response = await axios.post("/api/ai/chat", {
        message: currentInput,
      });

      const aiMessage: Message = {
        role: "assistant",
        content: response.data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error?.response?.data?.error || "Failed to get AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="
            fixed
            bottom-24 md:bottom-6
            right-6
            size-14
            rounded-full
            shadow-2xl
            z-50
          "
        >
          <Sparkles className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="
          w-full
          sm:max-w-lg
          p-0
          flex
          flex-col
        "
      >
        <div
          className="
            border-b
            p-4
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              size-10
              rounded-full
              bg-emerald-500/10
              flex
              items-center
              justify-center
            "
          >
            <Bot className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">AI Financial Assistant</h2>

            <p className="text-sm text-muted-foreground">
              Ask anything about your finance
            </p>
          </div>
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            p-4
            space-y-4
          "
        >
          {messages.length === 0 && (
            <div
              className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-center
                text-muted-foreground
              "
            >
              <Sparkles className="size-10 mb-4" />

              <p>
                Ask about your spending, goals, savings, or financial habits.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`
                  max-w-[85%]
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  whitespace-pre-wrap
                  ${
                    message.role === "user"
                      ? `
                        ml-auto
                        bg-emerald-500
                        text-white
                      `
                      : `
                        bg-muted
                      `
                  }
                `}
            >
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div
              className="
      bg-muted
      rounded-2xl
      px-4
      py-3
      text-sm
      w-fit
      flex
      items-center
      gap-1
    "
            >
              <span className="animate-bounce">.</span>

              <span
                className="
        animate-bounce
        [animation-delay:0.2s]
      "
              >
                .
              </span>

              <span
                className="
        animate-bounce
        [animation-delay:0.4s]
      "
              >
                .
              </span>
            </div>
          )}
        </div>

        <div
          className="
            border-t
            p-4
            flex
            items-center
            gap-2
          "
        >
          <Input
            placeholder="Ask AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <Button size="icon" onClick={sendMessage} disabled={loading}>
            <Send className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
