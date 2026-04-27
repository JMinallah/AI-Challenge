import { requireAuth, bindLogout } from './authGuard.js';
import { getLessons, getLessonProgress } from './dataStore.js';

const lessonsListEl = document.querySelector('#lessonsList');
const lessonsStateEl = document.querySelector('#lessonsState');
const completedCountEl = document.querySelector('#completedCount');
const streakEl = document.querySelector('#currentStreak');
const nextLessonEl = document.querySelector('#nextLesson');
const pagePrevBtn = document.querySelector('#pagePrevBtn');
const pageNextBtn = document.querySelector('#pageNextBtn');
const pageIndicator = document.querySelector('#pageIndicator');

let currentPage = 1;
const itemsPerPage = 5;
let globalLessonsWithUnlock = [];
let globalProgressMap = null;

function buildProgressMap(progressRows) {
	const map = new Map();
	progressRows.forEach((row) => map.set(row.lesson_id, row.status));
	return map;
}

function computeUnlocked(lessons, progressMap) {
	return lessons.map((lesson, index) => {
		if (index === 0) return { ...lesson, unlocked: true };
		const prev = lessons[index - 1];
		const prevStatus = progressMap.get(prev.id);
		return { ...lesson, unlocked: prevStatus === 'completed' };
	});
}

function renderLessonRow(lesson, status) {
	const state = status || (lesson.unlocked ? 'in_progress' : 'locked');
	const pillClass =
		state === 'completed'
			? 'status-pill status-pill--done'
			: state === 'locked'
				? 'status-pill status-pill--locked'
				: 'status-pill status-pill--ready';
	const label = state === 'completed' ? 'Completed' : state === 'locked' ? 'Locked' : 'Continue';

	if (state === 'locked') {
		return `
			<article class="lesson-row lesson-row--locked" aria-disabled="true">
				<div>
					<p class="lesson-day">Day ${lesson.day}</p>
					<h2>${lesson.title}</h2>
					<p class="lesson-meta">Tool: ${lesson.tool || '-'} • 15 min</p>
				</div>
				<span class="${pillClass}">${label}</span>
			</article>
		`;
	}

	return `
		<a class="lesson-row" href="lesson.html?lesson=${lesson.id}">
			<div>
				<p class="lesson-day">Day ${lesson.day}</p>
				<h2>${lesson.title}</h2>
				<p class="lesson-meta">Tool: ${lesson.tool || '-'} • 15 min</p>
			</div>
			<span class="${pillClass}">${label}</span>
		</a>
	`;
}

function computeStreak(progressRows) {
	const completedDates = progressRows
		.filter((row) => row.status === 'completed' && row.completed_at)
		.map((row) => new Date(row.completed_at).toDateString())
		.sort((a, b) => new Date(b) - new Date(a));

	if (completedDates.length === 0) return 0;
	const uniqueDates = [...new Set(completedDates)];
	let streak = 0;
	let cursor = new Date();

	while (uniqueDates.includes(cursor.toDateString())) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}

	return streak;
}

async function initLessonsPage() {
	const user = await requireAuth();
	if (!user) return;

	bindLogout();

	const [lessons, progressRows] = await Promise.all([getLessons(), getLessonProgress(user.id)]);
	globalProgressMap = buildProgressMap(progressRows);
	globalLessonsWithUnlock = computeUnlocked(lessons, globalProgressMap);

	if (lessons.length === 0) {
		if (lessonsListEl) {
			lessonsListEl.innerHTML = '<p class="auth-status status--error">No curriculum data found. Please ask the administrator to seed the curriculum.</p>';
		}
		if (lessonsStateEl) lessonsStateEl.remove();
		if (pagePrevBtn) pagePrevBtn.parentElement.style.display = 'none';
		return;
	}

	if (completedCountEl) {
		const done = progressRows.filter((item) => item.status === 'completed').length;
		completedCountEl.textContent = `${done} / ${lessons.length}`;
	}

	if (streakEl) {
		streakEl.textContent = `${computeStreak(progressRows)} days`;
	}

	if (nextLessonEl) {
		const next = globalLessonsWithUnlock.find((lesson) => lesson.unlocked && globalProgressMap.get(lesson.id) !== 'completed');
		nextLessonEl.textContent = next ? `Day ${next.day}` : 'All done';
	}

	if (lessonsStateEl) {
		lessonsStateEl.remove();
	}

	bindPagination();
	renderCurrentPage();
}

function bindPagination() {
	if (pagePrevBtn) {
		pagePrevBtn.addEventListener('click', () => {
			if (currentPage > 1) {
				currentPage--;
				renderCurrentPage();
			}
		});
	}
	if (pageNextBtn) {
		pageNextBtn.addEventListener('click', () => {
			const totalPages = Math.ceil(globalLessonsWithUnlock.length / itemsPerPage);
			if (currentPage < totalPages) {
				currentPage++;
				renderCurrentPage();
			}
		});
	}
}

function renderCurrentPage() {
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const pageLessons = globalLessonsWithUnlock.slice(startIndex, endIndex);

	const rows = pageLessons.map((lesson) => renderLessonRow(lesson, globalProgressMap.get(lesson.id))).join('');

	if (lessonsListEl) {
		lessonsListEl.innerHTML = rows || '<p class="auth-status">No lessons found on this page.</p>';
	}

	const totalPages = Math.ceil(globalLessonsWithUnlock.length / itemsPerPage) || 1;
	
	if (pageIndicator) pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;
	if (pagePrevBtn) pagePrevBtn.disabled = currentPage === 1;
	if (pageNextBtn) pageNextBtn.disabled = currentPage >= totalPages;
}

initLessonsPage();
