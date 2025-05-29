"use client";

import { Button } from "@/components/ui/button";
import { Githublogin, GoogleSignup } from "./action";

interface AuthClientProps {
  search?: string;
}

export default function AuthClient({ search }: AuthClientProps) {
  return (
    <section className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] z-10 flex flex-col items-center justify-center ">
      <main className="mt-8 max-w-[390px] lg:max-w-6xl  w-full mx-auto @container">
        <div className="w-full relative flex flex-col items-center justify-center isolate bg-blue-50/50 overflow-hidden px-4 py-6 h-full lg:py-8 min-h-[580px] text-[15.5px]">
          <div className="mt-10 max-w-3xl mx-auto flex flex-col items-center h-full">
            <div className="text-center space-y-5 ">
              <h1 className="text-[2.5rem] lg:text-[3.8rem] text-center text-[#36322F] font-semibold tracking-tight leading-[0.9] mt-4 ">
                Welcome to SanvAI
              </h1>
              <p className=" font-light text-base lg:text-lg max-w-lg mx-auto mt-2.5 text-zinc-500 text-center text-balance">
                Sign in below to start a session with your friends and family!
              </p>
              <form action={GoogleSignup}>
                <input type="hidden" name="redirect" value={search ?? ""} />
                <Button className="bg-[#111]">
                  {" "}
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="block"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  Start a session!
                </Button>
              </form>
              <form action={Githublogin}>
                <input type="hidden" name="redirect" value={search ?? ""} />
                <Button variant="outline" className="w-full max-w-[300px] mt-4">
                  Continue with Github
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground/60">
                <p>
                  By continuing, you agree to our{" "}
                  <a
                    href="/terms-of-service"
                    className="text-muted-foreground hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="text-muted-foreground hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
