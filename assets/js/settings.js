import { requireAuth, bindLogout } from './authGuard.js';

async function initSettingsPage() {
	const user = await requireAuth();
	if (!user) return;

	bindLogout();

	const saveBtn = document.getElementById('saveSettingsBtn');
	if (saveBtn) {
		saveBtn.addEventListener('click', () => {
			const originalText = saveBtn.textContent;
			saveBtn.textContent = 'Saved!';
			saveBtn.style.background = 'var(--accent)';
			
			setTimeout(() => {
				saveBtn.textContent = originalText;
				saveBtn.style.background = 'var(--ink)';
			}, 2000);
		});
	}
}

initSettingsPage();
