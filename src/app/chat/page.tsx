"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ArrowUp,
  Paperclip,
  RefreshCcw,
  SquarePen,
  Copy,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "user",
      text: "help me formalize this and add participant count 150!",
    },
    {
      role: "ai",
      text: "Sure! Here's a more formal version of your request: 'Please assist me in formalizing this document and including a participant count of 150.'",
    },
    {
      role: "user",
      text: "I need to make a presentation for a meeting with 150 participants.",
    },
    {
      role: "ai",
      text: "I understand. You need to prepare a presentation for a meeting that will have 150 participants.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
    {
      role: "user",
      text: "Can you help me with that?",
    },
    {
      role: "ai",
      text: "Of course! I can assist you in creating a presentation for your meeting.",
    },
  ]);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      const threshold = 10; // px, how close to bottom counts as "at bottom"
      const atBottom =
        scrollArea.scrollHeight -
          scrollArea.scrollTop -
          scrollArea.clientHeight <=
        threshold;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll);
      // Check initial position
      handleScroll();
      return () => {
        scrollArea.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const scrollToBottom = () => {
    console.log("scrollToBottom");
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  };

  return (
    <div className="min-h-[100vh] relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height] bg-zinc-50">
      <div className="absolute bottom-0 top-0 w-full">
        <div
          className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[200px]"
          id="scroll-area"
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 pb-10 pt-safe-offset-10">
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col space-y-8 px-4 py-6">
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
                        ? "group relative inline-block max-w-[80%] break-words rounded bg-zinc-100 px-4 py-3 text-left text-gray-700 "
                        : "group relative inline-block max-w-[80%] break-words rounded  px-4 py-3 text-left text-gray-700"
                    }
                  >
                    <div
                      className={
                        msg.role === "ai"
                          ? "prose prose-gray max-w-none prose-pre:m-0 prose-pre:bg-gray-50 prose-pre:p-2 prose-pre:rounded prose-pre:text-sm"
                          : ""
                      }
                    >
                      {msg.text}
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
                        onClick={() => handleCopy(msg.text)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-2 z-10 w-full px-2">
          <div className="relative mx-auto flex w-full max-w-3xl flex-col text-center">
            {!isAtBottom ? (
              <div className="flex justify-center">
                <Button
                  className="pointer-events-auto flex h-8 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 shadow-sm hover:bg-gray-50"
                  onClick={scrollToBottom}
                >
                  <span>Scroll to bottom</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <></>
            )}

            <form className="bg-gray-50/10 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm ">
              <div className="flex flex-grow flex-col px-3 py-2">
                <Textarea
                  id="chat-input"
                  placeholder="Type your message here..."
                  className="w-full resize-none border-0 bg-transparent text-base leading-6 text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0"
                  style={{
                    height: "48px",
                    minHeight: "48px",
                    maxHeight: "200px",
                  }}
                />

                <div className="mt-2 flex w-full items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-40">
                      <Select defaultValue="gpt-4.1-mini">
                        <SelectTrigger className="w-full h-8 text-sm font-normal text-gray-500 border-none bg-transparent focus:outline-none">
                          <SelectValue placeholder="Select LLM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4.1-mini">
                            GPT-4.1 Mini
                          </SelectItem>
                          <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">
                            GPT-3.5 Turbo
                          </SelectItem>
                          <SelectItem value="llama-3">Llama 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={<Paperclip className="h-4 w-4" />}
                      label="Attach files"
                      className="text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                    />
                    <Button
                      className="h-9 w-9 rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                      type="submit"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

type IconButtonProps = {
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function IconButton({ icon, label, className = "", onClick }: IconButtonProps) {
  return (
    <button
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-gray-100 ${className}`}
      aria-label={label}
      onClick={onClick}
    >
      <div className="relative size-4">{icon}</div>
    </button>
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
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white p-0 shadow-sm border border-gray-200 hover:bg-gray-50"
      aria-label={label}
      onClick={onClick}
    >
      <div className="relative size-3.5 text-gray-600">{icon}</div>
    </button>
  );
}
