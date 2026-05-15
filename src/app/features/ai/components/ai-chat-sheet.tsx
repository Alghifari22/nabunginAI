"use client";

import { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
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
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/ai/chat", { message: trimmed });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: axiosError.response?.data?.error || "Failed to get AI response.",
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
          className="fixed bottom-24 md:bottom-6 right-6 size-14 rounded-full shadow-2xl z-50"
        >
          <Sparkles className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center gap-3 shrink-0">
          <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Bot className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">AI Financial Assistant</h2>
            <p className="text-sm text-muted-foreground">Ask anything about your finance</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
              <Sparkles className="size-10" />
              <p className="text-sm max-w-xs">
                Ask about your spending, goals, savings, or financial habits.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-emerald-500 text-white"
                  : "bg-muted"
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="bg-muted rounded-2xl px-4 py-3 text-sm w-fit flex items-center gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce [animation-delay:0.2s]">.</span>
              <span className="animate-bounce [animation-delay:0.4s]">.</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4 flex items-center gap-2 shrink-0">
          <Input
            placeholder="Ask AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
