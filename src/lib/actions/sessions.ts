// lib/actions/session.ts
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'; // For App Router's useRouter type
// If using Pages Router, you might import from 'next/router' or simply use 'any' if types are an issue

/**
 * Handles the logic for starting a new chat session and redirecting the user.
 * This function should be called from a client component.
 *
 * @param {object} params - The parameters for the function.
 * @param {AppRouterInstance} params.router - The Next.js router instance from useRouter().
 * @param {(isLoading: boolean) => void} params.setIsLoading - The state setter for loading indicator.
 */
export async function createAndRedirectToNewSession({
  router,
  setIsLoading,
}: {
  router: AppRouterInstance;
  setIsLoading: (isLoading: boolean) => void;
}) {
  setIsLoading(true); // Set loading state to true
  try {
    const response = await fetch('/api/sessions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to create session:', response.statusText, errorData);
      alert(`Could not start chat: ${errorData.error || 'Unknown error'}`);
      return;
    }

    const sessionData = await response.json();
    const newSessionId = sessionData.sessionId;

    // Redirect to the new chat session page
    router.push(`/chat/${newSessionId}`);

  } catch (error) {
    console.error('An unexpected error occurred while starting chat:', error);
    alert('An unexpected error occurred. Please try again.');
  } finally {
    setIsLoading(false); // Reset loading state
  }
}