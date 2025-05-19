// lib/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr';
import { createServerClient as createLegacyServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers'; // Still need this import here
import { type CookieOptions } from '@supabase/ssr';

export const createClientComponentClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// --- CHANGE HERE: Make createServerClient ASYNC and AWAIT nextCookies() ---
export const createServerClient = async () => { // <--- ADD 'async' here
  const cookieStore = await nextCookies(); // <--- ADD 'await' here

  return createLegacyServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value; // Use the awaited cookieStore instance
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options); // Use the awaited cookieStore instance
          } catch (error) {
            console.warn('Could not set cookie in server client:', error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options); // Use the awaited cookieStore instance
          } catch (error) {
            console.warn('Could not remove cookie in server client:', error);
          }
        },
      },
    }
  );
};