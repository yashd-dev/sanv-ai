import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useRouter } from 'next/navigation'; // For navigation (App Router)
import { useState } from 'react'; // For the loading state
import { createAndRedirectToNewSession } from '../lib/actions/sessions'; // Your new function!

export default function Home() {
  const router = useRouter(); // Initialize the router
  const [isLoading, setIsLoading] = useState(false); // Initialize loading state

  // This is the simplified handler that calls your separated function
  const handleClick = () => {
    // Pass the router instance and the setIsLoading setter to your action function
    createAndRedirectToNewSession({ router, setIsLoading });
  };
  return (
    <section className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] z-10 flex flex-col items-center justify-center ">
      <main className="mt-8 max-w-[390px] lg:max-w-6xl  w-full mx-auto @ontainer">
        <div className="w-full relative flex flex-col items-center justify-center isolate bg-blue-50/50 overflow-hidden px-4 py-6 h-full lg:py-8 min-h-[580px] text-[15.5px]">
          <div className="mt-10 max-w-3xl mx-auto flex flex-col items-center h-full">
            <div className="text-center space-y-5 ">
              <a href="/pricing">
                <div
                  className="rounded-full border-[.75px] px-2.5 w-fit h-6 flex items-center text-xs font-medium border-[#E9E3DD] text-[#36322F] bg-[#FBFAF9] mb-2 mx-auto"
                  style={{
                    boxShadow:
                      "rgb(244, 241, 238) 0px -2.10843px 0px 0px inset, rgb(244, 241, 238) 0px 1.20482px 6.3253px 0px",
                  }}
                >
                  <span className="relative inline-flex items-center text-xs">
                    <span className="text-zinc-700 transition-transform duration-150 ease-in-out mr-1">
                      🔥
                    </span>{" "}
                    Shared AI sessions
                  </span>
                </div>
              </a>
              <h1 className="text-[2.5rem] lg:text-[3.8rem] text-center text-[#36322F] font-semibold tracking-tight leading-[0.9] mt-4 ">
                Realtime Collaborative
                <br />
                <span className="block leading-[1.1]">
                  <span className="relative px-1 animate-text transition-all text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-cyan-500 inline-flex justify-center items-center">
                    {" "}
                    Conversations with LLM's
                  </span>{" "}
                </span>
              </h1>
              <p className=" font-light text-base lg:text-lg max-w-lg mx-auto mt-2.5 text-zinc-500 text-center text-balance">
                Create a session, invite others, and interact with one shared AI
                live, turn-by-turn, with full context.
              </p>
              <Button
              onClick={handleClick} // This is the correct way to pass props
                disabled={isLoading}  // This is also a prop
              >
                {isLoading ? 'Starting your session...' : 'Start a session!'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
