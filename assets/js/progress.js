import { requireAuth, bindLogout } from './authGuard.js';
import { getLessons, getLessonProgress } from './dataStore.js';

const totalEl = document.querySelector('#progressTotal');
const streakEl = document.querySelector('#progressStreak');
const longestEl = document.querySelector('#progressLongest');
const listEl = document.querySelector('#weeklyProgressList');
const stateEl = document.querySelector('#progressState');

function computeStreaks(progressRows) {
	const completedDates = progressRows
		.filter((row) => row.status === 'completed' && row.completed_at)
		.map((row) => new Date(row.completed_at).toDateString())
		.sort((a, b) => new Date(a) - new Date(b));

	if (completedDates.length === 0) return { current: 0, longest: 0 };

	const unique = [...new Set(completedDates)];
	let longest = 1;
	let run = 1;

	for (let i = 1; i < unique.length; i += 1) {
		const prev = new Date(unique[i - 1]);
		const curr = new Date(unique[i]);
		const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
		if (diff === 1) {
			run += 1;
			longest = Math.max(longest, run);
		} else {
			run = 1;
		}
	}

	let current = 0;
	const today = new Date();
	while (unique.includes(today.toDateString())) {
		current += 1;
		today.setDate(today.getDate() - 1);
	}

	return { current, longest };
}

function renderWeekRows(lessons, progressRows) {
	const progressMap = new Map(progressRows.map((row) => [row.lesson_id, row.status]));
	const weeks = new Map();

	lessons.forEach((lesson) => {
		const key = lesson.week || 1;
		if (!weeks.has(key)) {
			weeks.set(key, { total: 0, done: 0 });
		}
		const bucket = weeks.get(key);
		bucket.total += 1;
		if (progressMap.get(lesson.id) === 'completed') bucket.done += 1;
	});

	return [...weeks.entries()]
		.sort((a, b) => a[0] - b[0])
		.map(([week, stats]) => {
			const statusClass =
				stats.done === 0 ? 'status-pill status-pill--locked' : stats.done === stats.total ? 'status-pill status-pill--done' : 'status-pill status-pill--ready';
			const statusLabel = stats.done === 0 ? 'Not started' : stats.done === stats.total ? 'Completed' : 'In progress';

			return `
				<article class="progress-row">
					<div>
						<h2>Week ${week}</h2>
						<p class="lesson-meta">${stats.done} of ${stats.total} lessons completed</p>
					</div>
					<span class="${statusClass}">${statusLabel}</span>
				</article>
			`;
		})
		.join('');
}

async function initProgressPage() {
	const user = await requireAuth();
	if (!user) return;

	bindLogout();

	const [lessons, progressRows] = await Promise.all([getLessons(), getLessonProgress(user.id)]);

	if (lessons.length === 0) {
		if (listEl) listEl.innerHTML = '<p class="auth-status status--error">No curriculum data found.</p>';
		if (stateEl) stateEl.remove();
		return;
	}

	const done = progressRows.filter((row) => row.status === 'completed').length;
	const streaks = computeStreaks(progressRows);

	if (totalEl) totalEl.textContent = `${done} / ${lessons.length}`;
	if (streakEl) streakEl.textContent = `${streaks.current} days`;
	if (longestEl) longestEl.textContent = `${streaks.longest} days`;

	if (listEl) {
		listEl.innerHTML = renderWeekRows(lessons, progressRows) || '<p class="auth-status">No progress available yet.</p>';
	}

	if (stateEl) stateEl.remove();
}

initProgressPage();
