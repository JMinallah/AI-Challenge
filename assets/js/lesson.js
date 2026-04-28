import { requireAuth, bindLogout } from './authGuard.js';
import { getLessons, getLessonProgress, upsertLessonProgress, getReflection, upsertReflection } from './dataStore.js';

const els = {
	lessonArea: document.querySelector('#lessonArea'),
	lessonTitle: document.querySelector('#lessonTitle'),
	lessonObjective: document.querySelector('#lessonObjective'),
	lessonConcept: document.querySelector('#lessonConcept'),
	lessonPrompt: document.querySelector('#lessonPrompt'),
	lessonPracticeTask: document.querySelector('#lessonPracticeTask'),
	lessonTips: document.querySelector('#lessonTips'),
	lessonReliabilityChecks: document.querySelector('#lessonReliabilityChecks'),
	lessonReflectionPrompts: document.querySelector('#lessonReflectionPrompts'),
	lessonTool: document.querySelector('#lessonTool'),
	lessonToolQuickStart: document.querySelector('#lessonToolQuickStart'),
	lessonState: document.querySelector('#lessonState'),
	reflectionInput: document.querySelector('#reflectionInput'),
	markCompleteBtn: document.querySelector('#markCompleteBtn'),
	saveReflectionBtn: document.querySelector('#saveReflectionBtn'),
	tabBtns: document.querySelectorAll('.tab-btn'),
	tabPanes: document.querySelectorAll('.tab-pane')
};

function setState(message, isError = false) {
	if (!els.lessonState) return;
	els.lessonState.textContent = message;
	els.lessonState.classList.toggle('status--error', isError);
}

function getLessonIdFromQuery() {
	const params = new URLSearchParams(window.location.search);
	return params.get('lesson');
}

async function initLessonPage() {
	const user = await requireAuth();
	if (!user) return;

	bindLogout();

	const lessonId = getLessonIdFromQuery();
	const lessons = await getLessons();
	
	if (lessons.length === 0) {
		if (els.lessonTitle) els.lessonTitle.textContent = 'Curriculum unavailable';
		if (els.lessonObjective) els.lessonObjective.textContent = '';
		setState('No lessons could be loaded. Please have the administrator seed the database.', true);
		return;
	}

	const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];

	if (!lesson) {
		setState('No lesson found.', true);
		return;
	}

	if (els.lessonArea) els.lessonArea.textContent = `Day ${lesson.day || '-'} • ${lesson.area || ''}`;
	if (els.lessonTitle) els.lessonTitle.textContent = lesson.title;
	if (els.lessonObjective) els.lessonObjective.textContent = lesson.objective || 'No objective available yet.';
	if (els.lessonConcept) els.lessonConcept.textContent = lesson.concept || '-';
	if (els.lessonPrompt) els.lessonPrompt.textContent = lesson.prompt || '-';
	if (els.lessonPracticeTask) els.lessonPracticeTask.textContent = lesson.practice_task || '-';
	
	if (els.lessonTool) els.lessonTool.innerHTML = `<strong>Tool:</strong> ${lesson.tool || '-'}`;
	if (els.lessonToolQuickStart) els.lessonToolQuickStart.textContent = lesson.tool_quick_start || '';

	const createList = (arr) => arr && arr.length ? arr.map(i => `<li>${i}</li>`).join('') : '<li>None</li>';

	const tips = lesson.tips || [];
	if (els.lessonTips) els.lessonTips.innerHTML = createList(tips);

	const reliability = lesson.reliability_checks || [];
	if (els.lessonReliabilityChecks) els.lessonReliabilityChecks.innerHTML = createList(reliability);

	const reflectionPrompts = lesson.reflection_prompts || [];
	if (els.lessonReflectionPrompts && reflectionPrompts.length > 0) {
		els.lessonReflectionPrompts.innerHTML = `<ul class="feature-list feature-list--stacked">${reflectionPrompts.map(p => `<li>${p}</li>`).join('')}</ul>`;
	} else if (els.lessonReflectionPrompts) {
		els.lessonReflectionPrompts.innerHTML = '';
	}

	// Handle specific day hardcoded resources
	const customResourcesBlock = document.querySelector('#customResourcesBlock');
	const customResourcesContent = document.querySelector('#customResourcesContent');
	
	if (customResourcesBlock && customResourcesContent) {
		// Example: Inject custom HTML only for Week 1 Day 1
		if (lesson.week === 1 && lesson.day === 1) {
			customResourcesBlock.hidden = false;
			customResourcesContent.innerHTML = `
                <div class="video-responsive">
                    <iframe src="https://www.youtube.com/embed/7u_G0dPsLHU?si=_Yc5TZYdT3KakxKx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
				</div>
			`;
		} 
		// Example: Custom HTML for Day 2
		else if (lesson.week === 1 && lesson.day === 2) {
			customResourcesBlock.hidden = false;
			customResourcesContent.innerHTML = `
				<ul class="feature-list">
					<li><a href="https://www.promptingguide.ai/techniques" target="_blank">Advanced Prompting Techniques Guide</a></li>
				</ul>
			`;
		} 
		// Hide for all other days
		else {
			customResourcesBlock.hidden = true;
			customResourcesContent.innerHTML = '';
		}
	}

	const savedReflection = await getReflection(user.id, lesson.id);
	if (els.reflectionInput) {
		els.reflectionInput.value = savedReflection;
	}

	const progressRows = await getLessonProgress(user.id);
	const current = progressRows.find((row) => row.lesson_id === lesson.id);
	if (current?.status === 'completed') {
		setState('You have already completed this lesson.');
		if (els.markCompleteBtn) {
			els.markCompleteBtn.textContent = 'Completed ✓';
			els.markCompleteBtn.disabled = true;
			els.markCompleteBtn.classList.replace('button--primary', 'button--secondary');
		}
	}

	els.markCompleteBtn?.addEventListener('click', async () => {
		setState('Saving completion...');
		const { error } = await upsertLessonProgress(user.id, lesson.id, 'completed');
		if (error) {
			setState(error.message, true);
			return;
		}
		setState('Lesson marked as complete.');
		if (els.markCompleteBtn) {
			els.markCompleteBtn.textContent = 'Completed ✓';
			els.markCompleteBtn.disabled = true;
			els.markCompleteBtn.classList.replace('button--primary', 'button--secondary');
		}
	});

	els.saveReflectionBtn?.addEventListener('click', async () => {
		const text = els.reflectionInput?.value?.trim() || '';
		setState('Saving notes...');
		const { error } = await upsertReflection(user.id, lesson.id, text);
		if (error) {
			setState(error.message, true);
			return;
		}
		setState('Notes saved.');
	});

	if (els.tabBtns && els.tabPanes) {
		els.tabBtns.forEach((btn) => {
			btn.addEventListener('click', () => {
				const tabId = btn.getAttribute('data-tab');
				
				els.tabBtns.forEach((b) => b.classList.remove('active'));
				btn.classList.add('active');

				els.tabPanes.forEach((pane) => {
					if (pane.id === `tab-${tabId}`) {
						pane.hidden = false;
					} else {
						pane.hidden = true;
					}
				});
			});
		});
	}

	const nextTabBtns = document.querySelectorAll('.next-tab-btn');
	if (nextTabBtns) {
		nextTabBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				const targetTab = btn.getAttribute('data-target');
				const targetBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
				if (targetBtn) {
					targetBtn.click();
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}
			});
		});
	}
}

initLessonPage();
