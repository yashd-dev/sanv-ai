"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Settings,
  LogOut,
  Check,
  Zap,
  Headphones,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";
import { format, toZonedTime } from "date-fns-tz";

export default function AccountSettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [localResetTime, setLocalResetTime] = useState<string>("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    // Get user's timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create a date for 12 AM IST
    const today = new Date();
    const istResetTime = new Date(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}T00:00:00`
    );

    // Convert to user's local time
    const localTime = toZonedTime(istResetTime, userTimeZone);

    // Format the time
    const formattedTime = format(localTime, "h:mm a", {
      timeZone: userTimeZone,
    });
    setLocalResetTime(formattedTime);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[calc(100dvh-4rem)] bg-blue-50/30 flex items-center justify-center">
          <div className="text-zinc-500">Loading...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  const userInitial = user.email?.[0].toUpperCase() || "?";
  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <>
      <div className="min-h-[calc(100dvh-4rem)] ">
        {/* Header */}
        <header className="flex items-center justify-between p-4  border-zinc-200">
          <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                onClick={handleSignOut}
              >
                Sign out
                <LogOut className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-72  p-6 e">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 relative overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative text-xl font-bold text-white">
                      {userInitial}
                    </div>
                  </>
                )}
              </div>
              <h2 className="text-lg font-semibold mb-1 text-zinc-900">
                {userName}
              </h2>
              <p className="text-zinc-500 text-sm mb-3">{user.email}</p>
              <Badge
                variant="secondary"
                className="bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"
              >
                Free Plan
              </Badge>
            </div>

            {/* Message Usage */}
            <Card className="bg-white border-zinc-200 mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-zinc-900">
                    Message Usage
                  </CardTitle>
                  <span className="text-xs text-zinc-500">
                    Resets at {localResetTime} your time
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-zinc-500">Standard</span>
                      <span className="text-zinc-900">0/20</span>
                    </div>
                    <Progress value={0} className="h-2 bg-zinc-100" />
                  </div>
                  <p className="text-xs text-zinc-500">20 messages remaining</p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-blue-50/30">
            {/* Navigation Tabs */}
            <nav className="flex flex-wrap gap-6 mb-8 border-b border-zinc-200 pb-4">
              <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
                Account
              </button>
              <button className="text-zinc-500 hover:text-zinc-900 pb-2">
                Customization
              </button>
              <button className="text-zinc-500 hover:text-zinc-900 pb-2">
                History & Sync
              </button>
              <button className="text-zinc-500 hover:text-zinc-900 pb-2">
                Models
              </button>
              <button className="text-zinc-500 hover:text-zinc-900 pb-2">
                API Keys
              </button>
              <button className="text-zinc-500 hover:text-zinc-900 pb-2">
                Attachments
              </button>
              <button className="text-zinc-500 hover:text-zinc-900 pb-2">
                Contact Us
              </button>
            </nav>

            {/* Upgrade to Pro Section */}
            <Card className="bg-white border-zinc-200 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-zinc-900">
                    Upgrade to Pro
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-zinc-900">
                      $8
                      <span className="text-sm font-normal text-zinc-500">
                        /month
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-zinc-900">
                        Access to All Models
                      </h3>
                      <p className="text-sm text-zinc-500">
                        Get access to our full suite of models including Claude,
                        o3-mini-high, and more!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-zinc-900">
                        Generous Limits
                      </h3>
                      <p className="text-sm text-zinc-500">
                        Receive{" "}
                        <span className="text-zinc-900">
                          1500 standard credits
                        </span>{" "}
                        per month, plus{" "}
                        <span className="text-zinc-900">
                          100 premium credits*
                        </span>{" "}
                        per month.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-zinc-900">
                        Priority Support
                      </h3>
                      <p className="text-sm text-zinc-500">
                        Get faster responses and dedicated assistance from the
                        T3 team whenever you need help!
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mb-4">
                  Upgrade Now
                </Button>

                <p className="text-xs text-zinc-500">
                  * Premium credits are used for GPT Image Gen, Claude Sonnet,
                  and Grok 3. Additional Premium credits can be purchased
                  separately.
                </p>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className=" bg-transparent shadow-none border-0 ">
              <CardHeader>
                <CardTitle className="text-xl text-red-600">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-500 mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
