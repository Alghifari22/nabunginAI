"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import axios, { AxiosError } from "axios";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  role: "user" | "assistant";
  content: string;
};

type Position = { x: number; y: number };

// ── Constants ─────────────────────────────────────────────────────────────────
const BUTTON_SIZE = 56; // px — size-14
const EDGE_MARGIN = 16; // px — safe distance from screen edges
const BOTTOM_NAV_HEIGHT = 80; // px — mobile bottom navbar clearance
const DRAG_THRESHOLD = 6; // px — movement needed to count as drag vs tap

// ── Snap to nearest edge ──────────────────────────────────────────────────────
function snapToEdge(x: number, y: number): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const maxX = vw - BUTTON_SIZE - EDGE_MARGIN;
  const maxY = vh - BUTTON_SIZE - BOTTOM_NAV_HEIGHT;
  const minY = EDGE_MARGIN;

  const clampedX = Math.max(EDGE_MARGIN, Math.min(x, maxX));
  const clampedY = Math.max(minY, Math.min(y, maxY));

  // Snap to left or right edge
  const snapX =
    clampedX < vw / 2 ? EDGE_MARGIN : vw - BUTTON_SIZE - EDGE_MARGIN;

  return { x: snapX, y: clampedY };
}

// ── Default position (bottom-right, above mobile navbar) ──────────────────────
function getDefaultPosition(): Position {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return {
    x: window.innerWidth - BUTTON_SIZE - EDGE_MARGIN,
    y: window.innerHeight - BUTTON_SIZE - BOTTOM_NAV_HEIGHT,
  };
}

// ── Draggable Floating Button ─────────────────────────────────────────────────
function DraggableButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const [pos, setPos] = useState<Position>(getDefaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const dragStart = useRef<{ px: number; py: number; bx: number; by: number } | null>(null);
  const totalMove = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Recalculate position on resize
  useEffect(() => {
    const onResize = () => {
      setPos((prev) => snapToEdge(prev.x, prev.y));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { px: e.clientX, py: e.clientY, bx: pos.x, by: pos.y };
    totalMove.current = 0;
    setIsPressed(true);
  }, [pos]);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragStart.current) return;

    const dx = e.clientX - dragStart.current.px;
    const dy = e.clientY - dragStart.current.py;
    totalMove.current = Math.sqrt(dx * dx + dy * dy);

    if (totalMove.current > DRAG_THRESHOLD) {
      setIsDragging(true);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const newX = Math.max(EDGE_MARGIN, Math.min(dragStart.current.bx + dx, vw - BUTTON_SIZE - EDGE_MARGIN));
      const newY = Math.max(EDGE_MARGIN, Math.min(dragStart.current.by + dy, vh - BUTTON_SIZE - BOTTOM_NAV_HEIGHT));
      setPos({ x: newX, y: newY });
    }
  }, []);

  const onPointerUp = useCallback(() => {
    const wasDrag = totalMove.current > DRAG_THRESHOLD;

    if (wasDrag) {
      // Snap to nearest edge after release
      setPos((prev) => snapToEdge(prev.x, prev.y));
    } else {
      // It was a tap — trigger click
      onClick();
    }

    dragStart.current = null;
    totalMove.current = 0;
    setIsDragging(false);
    setIsPressed(false);
  }, [onClick]);

  return (
    <button
      ref={buttonRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        zIndex: 50,
        touchAction: "none",
        userSelect: "none",
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "left 0.25s cubic-bezier(0.34,1.56,0.64,1), top 0.1s ease",
        transform: isPressed && !isDragging ? "scale(0.92)" : "scale(1)",
      }}
      className={cn(
        "rounded-full shadow-2xl",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center",
        "border border-white/10",
        "backdrop-blur-xl",
        "transition-transform duration-150",
        // Subtle floating pulse when idle
        !isDragging && !isPressed && "animate-[float_3s_ease-in-out_infinite]"
      )}
      aria-label="Open AI Assistant"
    >
      <Sparkles className="size-6 pointer-events-none" />
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AIChatSheet() {
  const [open, setOpen] = useState(false);
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
    <>
      {/* Draggable floating button */}
      <DraggableButton onClick={() => setOpen(true)} />

      {/* Chat sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full sm:max-w-lg p-0 flex flex-col"
        >
          {/* Hidden title for screen readers */}
          <SheetTitle className="sr-only">AI Financial Assistant</SheetTitle>
          {/* Header */}
          <div className="border-b p-4 flex items-center gap-3 shrink-0">
            <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Bot className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold">AI Financial Assistant</h2>
              <p className="text-xs text-muted-foreground">Ask anything about your finance</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-xl shrink-0"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3 py-12">
                <div className="size-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                  <Sparkles className="size-8 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Nabungin.AI Assistant</p>
                  <p className="text-sm max-w-xs">
                    Ask about your spending, goals, savings, or financial habits.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-emerald-500 text-white rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ))}

            {loading && (
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 text-sm w-fit flex items-center gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                <span className="animate-bounce [animation-delay:0.4s]">.</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 flex items-center gap-2 shrink-0 pb-safe">
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
              className="h-11 rounded-xl"
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="size-11 rounded-xl shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
