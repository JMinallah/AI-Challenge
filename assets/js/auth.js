import { supabase } from './supabaseClient.js';
const statusEl = document.querySelector('[data-status]');
const signInForm = document.querySelector('[data-form="sign-in"]');
const signUpForm = document.querySelector('[data-form="sign-up"]');
const googleButton = document.querySelector('[data-action="google-sign-in"]');

function setStatus(message, isError = false) {
	if (!statusEl) return;
	statusEl.textContent = message;
	statusEl.classList.toggle('status--error', isError);
}

async function redirectIfAlreadyLoggedIn() {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session?.user) {
		window.location.href = 'courses.html';
	}
}

async function handleSignIn(event) {
	event.preventDefault();
	if (!signInForm) return;

	const formData = new FormData(signInForm);
	const email = String(formData.get('email') || '').trim();
	const password = String(formData.get('password') || '');

	setStatus('Signing you in...');
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		setStatus(error.message, true);
		return;
	}

	window.location.href = 'courses.html';
}

async function handleSignUp(event) {
	event.preventDefault();
	if (!signUpForm) return;

	const formData = new FormData(signUpForm);
	const fullName = String(formData.get('fullName') || '').trim();
	const email = String(formData.get('registerEmail') || '').trim();
	const password = String(formData.get('registerPassword') || '');

	setStatus('Creating your account...');
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { full_name: fullName },
			emailRedirectTo: `${window.location.origin}/courses.html`
		}
	});

	if (error) {
		setStatus(error.message, true);
		return;
	}

	setStatus('Account created. Redirecting to login...');
	window.setTimeout(() => {
		window.location.href = 'login.html';
	}, 1200);
}

async function handleGoogleSignIn() {
	setStatus('Opening Google sign-in...');
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${window.location.origin}/courses.html`
		}
	});

	if (error) {
		setStatus(error.message, true);
	}
}

if (signInForm) {
	signInForm.addEventListener('submit', handleSignIn);
}

if (signUpForm) {
	signUpForm.addEventListener('submit', handleSignUp);
}

if (googleButton) {
	googleButton.addEventListener('click', handleGoogleSignIn);
}

redirectIfAlreadyLoggedIn();

console.log('Auth module loaded');
