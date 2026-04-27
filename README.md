# Stepsy

A simple, modular web app for guided AI learning.

Brand: Stepsy

## Stack
- HTML
- CSS
- JavaScript
- Supabase

## Structure
- `index.html` - landing page
- `login.html` - login page
- `register.html` - registration page
- `auth.html` - legacy redirect to login
- `lessons.html` - lesson list and unlock flow
- `lesson.html` - single lesson detail view
- `progress.html` - progress overview
- `assets/css/styles.css` - shared styling
- `assets/js/` - modular client-side logic
- `assets/data/` - lesson content JSON

## Setup
1. Copy `.env.example` to `.env` if needed.
2. Fill in Supabase values.
3. Update `assets/js/config.js` with your Supabase URL and anon key.
4. Open the app in a static server or deploy to hosting.

## Notes
- The UI is mobile-first and should scale cleanly to larger screens.
- Auth is connected in `login.html`, `register.html`, and `assets/js/auth.js`.
- The landing page uses standard sections, not unnecessary cards.
