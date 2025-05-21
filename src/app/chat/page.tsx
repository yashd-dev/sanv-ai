"use client";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ArrowUp,
  Paperclip,
  RefreshCcw,
  SquarePen,
  Copy,
  Check,
  Sparkles,
  Newspaper,
  Code,
  GraduationCap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useMarkdownProcessor } from "@/hook/markdownProcessor";

type TabType = "create" | "explore" | "code" | "learn";

const TAB_PROMPTS = {
  create: [
    "Cook up a fresh project idea",
    "Design a UI that actually vibes",
    "Spin me a story, ChatGPT-style",
    "Plan a marketing drop that turns heads",
  ],
  explore: [
    "What's poppin in AI this week?",
    "Quantum computing, but make it make sense",
    "Explain blockchain like I'm not already confused",
    "Give me the latest space tea",
  ],
  code: [
    "Code's broken fix it before I cry",
    "Explain this algorithm like homer simpson",
    "Make this function faster than my attention span",
    "Build a REST API that doesn't roast me",
  ],
  learn: [
    "ML basics without the brain melt",
    "Neural networks: hype or high-key genius?",
    "Deep learning explained, minus the headache",
    "Transformers not the robot kind",
  ],
};

function MessageContent({ content }: { content: string }) {
  const processedContent = useMarkdownProcessor(content);
  return <>{processedContent}</>;
}

export default function Chat() {
  const { messages, input, setInput, append, isLoading } = useChat();
  const [isCopied, setIsCopied] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScroll = () => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const threshold = 10;
      const atBottom =
        scrollArea.scrollHeight -
          scrollArea.scrollTop -
          scrollArea.clientHeight <=
        threshold;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => {
        scrollArea.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const scrollToBottom = () => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSending(true);
    try {
      await append({ content: input, role: "user" });
      setInput("");
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-zinc-50">
      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollAreaRef}
          className="h-full overflow-y-auto px-4 py-6 pb-32"
        >
          {messages.length === 0 && !input && (
            <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10">
              <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
                <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
                  <h2 className="text-3xl font-semibold">
                    How can I help you?
                  </h2>
                  <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
                    <Button
                      variant="outline"
                      className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed ${
                        activeTab === "create"
                          ? "bg-primary text-black"
                          : "bg-secondary/30 text-secondary-foreground/90"
                      } h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full`}
                      onClick={() => handleTabClick("create")}
                    >
                      <Sparkles className="max-sm:block" />
                      <div>Create</div>
                    </Button>
                    <Button
                      variant="outline"
                      className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed ${
                        activeTab === "explore"
                          ? "bg-primary text-black"
                          : "bg-secondary/30 text-secondary-foreground/90"
                      } h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full`}
                      onClick={() => handleTabClick("explore")}
                    >
                      <Newspaper className="max-sm:block" />
                      <div>Explore</div>
                    </Button>
                    <Button
                      variant="outline"
                      className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed ${
                        activeTab === "code"
                          ? "bg-primary text-black"
                          : "bg-secondary/30 text-secondary-foreground/90"
                      } h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full`}
                      onClick={() => handleTabClick("code")}
                    >
                      <Code className="max-sm:block" />
                      <div>Code</div>
                    </Button>
                    <Button
                      variant="outline"
                      className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed ${
                        activeTab === "learn"
                          ? "bg-primary text-black"
                          : "bg-secondary/30 text-secondary-foreground/90"
                      } h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full`}
                      onClick={() => handleTabClick("learn")}
                    >
                      <GraduationCap className="max-sm:block" />
                      <div>Learn</div>
                    </Button>
                  </div>
                  <div className="flex flex-col text-foreground">
                    {TAB_PROMPTS[activeTab].map((prompt, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none"
                      >
                        <button
                          className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
                          onClick={() => handleSuggestionClick(prompt)}
                        >
                          <span>{prompt}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mx-auto max-w-3xl space-y-8">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex text-sm ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "group relative inline-block max-w-[80%] break-words rounded bg-zinc-100 px-4 py-3 text-left text-gray-700"
                      : "group relative inline-block max-w-[80%] break-words rounded px-4 py-3 text-left text-gray-700"
                  }
                >
                  <div
                    className={
                      msg.role === "assistant"
                        ? "prose prose-sm prose-gray prose-pre:bg-transparent "
                        : ""
                    }
                  >
                    <MessageContent content={msg.content} />
                  </div>
                  <div
                    className={`absolute ${
                      msg.role === "user" ? "right-0" : "left-0"
                    } -bottom-6 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100`}
                  >
                    {msg.role === "user" && (
                      <>
                        <ActionButton
                          icon={<RefreshCcw className="h-3.5 w-3.5" />}
                          label="Retry message"
                        />
                        <ActionButton
                          icon={<SquarePen className="h-3.5 w-3.5" />}
                          label="Edit message"
                        />
                      </>
                    )}
                    <ActionButton
                      icon={
                        isCopied ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )
                      }
                      label="Copy"
                      onClick={() => handleCopy(msg.content)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-white via-white/80 to-transparent pt-4 pb-6">
        <div className="mx-auto max-w-3xl px-4">
          {!isAtBottom && (
            <div className="mb-4 flex justify-center">
              <Button
                className="flex h-8 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 shadow-sm hover:bg-gray-50"
                onClick={scrollToBottom}
              >
                <span>Scroll to bottom</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-white/20 bg-white/70 p-2 shadow-lg backdrop-blur-lg"
          >
            <div className="flex flex-col">
              <Textarea
                id="chat-input"
                placeholder="Type your message here..."
                className="w-full resize-none border-0 bg-transparent text-base leading-6 text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0"
                style={{
                  height: "48px",
                  minHeight: "48px",
                  maxHeight: "200px",
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-white/50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="h-8 bg-white/80 hover:bg-white"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      <span className="text-sm">Sending...</span>
                    </div>
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-6 items-center gap-1 rounded-md bg-white px-2 text-xs text-gray-500 hover:bg-gray-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
