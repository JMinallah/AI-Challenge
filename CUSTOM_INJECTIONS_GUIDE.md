# Guide: Injecting Custom Content for Specific Days

Because Stepsy is built with Vanilla JavaScript, you don't have to rely only on predefined hidden blocks (like the `#customResourcesBlock` we added at the bottom of the Learn section). You can dynamically target **any existing element** on the page and insert custom HTML right before or after it using JavaScript's `insertAdjacentHTML` method.

Here are templates and explanations for how to inject content into specific areas inside `assets/js/lesson.js`.

---

## The Method: `insertAdjacentHTML`
This native JavaScript function allows you to place newly generated HTML relative to an element you select. The positions you can use are:
- `'beforebegin'` - Right before the target element itself.
- `'afterbegin'` - Inside the target element, before its first child.
- `'beforeend'` - Inside the target element, after its last child.
- `'afterend'` - Right after the target element itself.

---

## Template Examples to add to `lesson.js`

Instead of just un-hiding a block, you can group all your specific-day overrides in a single function and call it during `initLessonPage()`.

### 1. After the "Prompt of the Day" (Practice Tab)

If you want to add an extra explanation, video, or diagram specifically for **Week 1, Day 2**, directly below the Prompt text:

```javascript
if (lesson.week === 1 && lesson.day === 2) {
    const promptElement = document.querySelector('#lessonPrompt');
    // Using 'afterend' places it immediately below the prompt paragraph
    promptElement.insertAdjacentHTML('afterend', `
        <div class="custom-injection" style="margin-top: 16px; padding: 16px; background: rgba(0,0,0,0.03); border-radius: 12px; border-left: 4px solid var(--accent);">
            <h3 style="font-size: 1rem; margin-top: 0;">💡 Deep Dive Explanation</h3>
            <p style="margin-bottom: 0;">This prompt works incredibly well because it uses the "Act as an Expert" framework. Notice how we defined constraints immediately.</p>
        </div>
    `);
}
```

### 2. Before the "Concept" text (Learn Tab)

If you want to add an introductory video at the very top of the concept section for **Week 2, Day 1**:

```javascript
if (lesson.week === 2 && lesson.day === 1) {
    const conceptElement = document.querySelector('#lessonConcept');
    // Using 'beforebegin' stacks it before the concept paragraph begins
    conceptElement.insertAdjacentHTML('beforebegin', `
        <div class="custom-injection" style="margin-bottom: 20px;">
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="border-radius: 12px;"></iframe>
        </div>
    `);
}
```

### 3. Modifying the existing "Tool Setup" text dynamically

If you want to inject a specific download link to the tool text for **Week 1, Day 4**:

```javascript
if (lesson.week === 1 && lesson.day === 4) {
    const toolElement = document.querySelector('#lessonToolQuickStart');
    // 'afterend' puts a nice button directly below the tool instructions
    toolElement.insertAdjacentHTML('afterend', `
        <a href="https://example.com/download" target="_blank" class="button button--secondary" style="margin-top: 12px; display: inline-block;">
            Download the Extension Here
        </a>
    `);
}
```

### 4. Grouping it all cleanly in `lesson.js`

Rather than cluttering your main data-loading flow, you can place this block right before checking `if (els.tabBtns && els.tabPanes)` towards the bottom of `assets/js/lesson.js`:

```javascript
// --- CUSTOM CONTENT INJECTIONS ---
function injectCustomDayContent(currentLesson) {
    // Week 1, Day 1
    if (currentLesson.week === 1 && currentLesson.day === 1) {
        document.querySelector('#lessonPrompt').insertAdjacentHTML('afterend', '<div><p>Extra prompt hint for Day 1!</p></div>');
    }
    
    // Week 1, Day 3
    else if (currentLesson.week === 1 && currentLesson.day === 3) {
        document.querySelector('#lessonConcept').insertAdjacentHTML('beforebegin', '<div><p>Welcome to Day 3!</p></div>');
    }
}

// Call it
injectCustomDayContent(lesson);
// ---------------------------------
```

## Re-running Lessons
Whenever JavaScript uses `insertAdjacentHTML`, it injects the HTML perfectly into the page just for that user's current session. When they click to another lesson, the page reloads and pulls the fresh, unaltered layout for the new lesson, ensuring your custom additions never mistakenly "bleed" into the wrong day.