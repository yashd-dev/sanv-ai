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
  ChevronUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMarkdownProcessor } from "@/hook/markdownProcessor";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

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

interface Session {
  id: string;
  created_at: string;
  user_id: string;
}

interface Message {
  id: string;
  session_id: string;
  sender_id: string | null; // Can be null for LLM responses
  role: "user" | "assistant";
  content: string;
  created_at: string;
  is_llm_response?: boolean;
  sequence_number: number;
}

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface ChatClientProps {
  session: Session;
  messages: Message[];
  userId: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
  };
}

export default function ChatClient({
  session,
  messages: initialMessages,
  userId,
  pagination,
}: ChatClientProps) {
  // Add a ref to store the current sequence number for message pairs
  const currentSequenceRef = useRef<number | null>(null);

  const { messages, input, setInput, append } = useChat({
    initialMessages: initialMessages
      .sort((a, b) => {
        // Primary sort by sequence number
        if (a.sequence_number !== b.sequence_number) {
          return a.sequence_number - b.sequence_number;
        }
        // Secondary sort: user messages (is_llm_response: false) before LLM responses (is_llm_response: true)
        // A 'false' value (user message) is considered "less than" a 'true' value (LLM response)
        // so `false - true` would be `0 - 1 = -1` (a comes before b)
        // and `true - false` would be `1 - 0 = 1` (b comes before a)
        return (a.is_llm_response ? 1 : 0) - (b.is_llm_response ? 1 : 0);
      })
      .map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
      })) as ChatMessage[],
    onFinish: async (message) => {
      // Store LLM response in database
      const supabase = createClient();
      try {
        // Use the stored sequence number for the LLM response
        const sequenceNumber = currentSequenceRef.current;
        if (sequenceNumber === null) {
          console.error("No sequence number available for LLM response");
          return;
        }

        const { error } = await supabase.from("messages").insert({
          session_id: session.id,
          sender_id: null,
          role: "assistant",
          content: message.content,
          created_at: new Date().toISOString(),
          is_llm_response: true,
          sequence_number: sequenceNumber, // Use the same sequence as user message
        });

        if (error) {
          console.error("Error saving LLM response:", error);
        }

        // Clear the sequence number after use
        currentSequenceRef.current = null;
      } catch (error) {
        console.error("Error saving LLM response:", error);
        // Clear sequence number on error
        currentSequenceRef.current = null;
      }
    },
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("create");
  const [isSending, setIsSending] = useState(false);
  const MAX_RETRIES = 3;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showCollaborate, setShowCollaborate] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const searchParams = useSearchParams();
  const sessionId = session.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Set invite URL on client-side
  useEffect(() => {
    setInviteUrl(`${window.location.origin}/chat/${sessionId}?invite=1`);
  }, [sessionId]);

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
  }, [messages, isAtBottom]);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSending(true);
    const messageContent = input;
    setInput("");

    try {
      // Generate a unique sequence number for this message pair
      const timestamp = Date.now();
      currentSequenceRef.current = timestamp; // Store for LLM response

      // First append to UI for immediate feedback
      await append({ content: messageContent, role: "user" });

      // Then try to save to database with retries
      const supabase = createClient();
      let success = false;
      let attempts = 0;

      while (!success && attempts < MAX_RETRIES) {
        try {
          const { error } = await supabase.from("messages").insert({
            session_id: sessionId,
            sender_id: userId,
            role: "user",
            content: messageContent,
            created_at: new Date().toISOString(),
            is_llm_response: false,
            sequence_number: timestamp, // Use the same timestamp
          });

          if (error) throw error;
          success = true;
        } catch (error) {
          attempts++;
          if (attempts === MAX_RETRIES) {
            console.error(
              "Failed to save message after",
              MAX_RETRIES,
              "attempts:",
              error
            );
            throw error;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempts) * 1000)
          );
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Clear sequence number on error
      currentSequenceRef.current = null;
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

  const handleNewChat = async () => {
    try {
      const response = await fetch("/api/sessions/create", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to create session");
      }
      const data = await response.json();
      if (data.sessionId) {
        router.push(`/chat/${data.sessionId}`);
      } else {
        throw new Error("No session ID received");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  // Add participant if ?invite=1 is present
  useEffect(() => {
    const addParticipantIfNeeded = async () => {
      const invite = searchParams.get("invite");
      if (invite === "1") {
        const supabase = createClient();
        // Check if already a participant
        const { data: existing } = await supabase
          .from("session_participants")
          .select("id")
          .eq("session_id", sessionId)
          .eq("user_id", userId)
          .single();
        if (!existing) {
          await supabase.from("session_participants").insert({
            session_id: sessionId,
            user_id: userId,
            joined_at: new Date().toISOString(),
          });
        }
      }
    };
    addParticipantIfNeeded();
  }, [searchParams, sessionId, userId]);

  // Update real-time subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only append if it's not from the current user (to avoid duplicates)
          // and if it's not an LLM response (those are handled by onFinish)
          if (newMessage.sender_id !== userId && !newMessage.is_llm_response) {
            append({
              content: newMessage.content,
              role: newMessage.role,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId, append]);

  const loadMoreMessages = async () => {
    if (pagination.currentPage >= pagination.totalPages || isLoadingMore)
      return;

    setIsLoadingMore(true);
    try {
      const nextPage = pagination.currentPage + 1;
      router.push(`/chat/${session.id}?page=${nextPage}`, { scroll: false });
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-zinc-50">
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline">🏠 Home</Button>
            </Link>
            <Button variant="default" onClick={handleNewChat}>
              ➕ New Chat
            </Button>
          </div>
          <Dialog open={showCollaborate} onOpenChange={setShowCollaborate}>
            <DialogTrigger asChild>
              <Button variant="secondary">🤝 Collaborate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite to Collaborate</DialogTitle>
                <DialogDescription>
                  Share this link with others to invite them to this session:
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    setInviteCopied(true);
                    setTimeout(() => setInviteCopied(false), 2000);
                  }}
                >
                  {inviteCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollAreaRef}
            className="h-full overflow-y-auto px-4 py-6 pb-32"
          >
            {pagination.currentPage < pagination.totalPages && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMoreMessages}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Messages</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
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
              className="rounded-xl border border-white/20 bg-white/70 p-2 shadow-lg backdrop-blur-sm"
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
                    className="h-8 bg-black hover:bg-white !disabled:bg-zinc-900"
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
    </>
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
