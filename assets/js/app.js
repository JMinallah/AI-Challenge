const signInLink = document.querySelector('[href="auth.html"]');

if (signInLink) {
	signInLink.addEventListener('click', () => {
		console.log('Landing page sign in clicked');
	});
}

console.log('AI Learning App loaded');
