import { requireAuth, bindLogout } from './authGuard.js';

async function initDashboard() {
        const user = await requireAuth();
        if (!user) return;

        bindLogout();
}

initDashboard();