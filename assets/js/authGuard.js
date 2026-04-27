import { supabase } from './supabaseClient.js';

export async function requireAuth(redirectTo = 'login.html') {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    window.location.href = redirectTo;
    return null;
  }

  return session.user;
}

export function bindLogout() {
  const logoutLinks = document.querySelectorAll('[data-action="logout"]');
  logoutLinks.forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  });
}