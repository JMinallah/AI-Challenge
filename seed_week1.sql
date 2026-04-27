-- Stepsy Week 1 seed data for public.curriculum_lessons
-- This script first deletes all existing week 1 rows, then inserts the full detailed curriculum.

begin;

delete from public.curriculum_lessons
where week = 1;

insert into public.curriculum_lessons (
  id,
  week,
  day,
  area,
  title,
  objective,
  concept,
  tool,
  tool_quick_start,
  prompt,
  tips,
  practice_task,
  reliability_checks,
  reflection_prompts,
  unlock_after,
  is_active
)
values
  (
    'w1d1',
    1,
    1,
    'Project Planning and Management',
    'Why ChatGPT Often Feels Unreliable + First Reliable Prompt',
    'Learn why generic prompts give poor results and master the Role + Context technique to get consistent, professional project overviews.',
    'ChatGPT (and most AI models) is a next-word predictor. Without strong guidance, it often produces vague, generic, or hallucinated answers. The Role + Context technique tells the AI exactly who it should be and gives it relevant background. This dramatically reduces unreliability and makes outputs feel professional.',
    'ChatGPT',
    'Go to chatgpt.com (or the mobile app). Sign in with Google or email. Always start a new chat for each lesson to keep responses clean. Paste the prompt and press Enter.',
    'Act as a senior project manager with 15+ years of experience in development projects. You always think step-by-step and never make up facts - if unsure, say so. Create a high-level overview plan for [describe your project here, e.g., a 6-month community health initiative with limited budget and team of 5-10 people, plus quarterly donor reporting]. Include main phases, key deliverables, and potential challenges. Output in a simple numbered list with brief explanations.',
    '["Always begin prompts with \"Act as a senior [specific role]...\" - this sets a consistent expert personality.", "Add specific context about your project (location, budget, team size, donor requirements, etc.) - more details = fewer hallucinations and more useful answers.", "Include \"You always think step-by-step and never make up facts\" to encourage careful reasoning.", "If the response feels off or too short, immediately reply with a follow-up like \"Make the risks section more detailed\" or \"Revise assuming a 20% budget cut.\""]'::jsonb,
    'Replace the placeholder with a real or sample project from your work. Run the prompt, then make one small tweak (e.g., add one important constraint or local challenge).',
    '["Do the phases feel realistic for your type of work?", "Are there any obvious made-up facts or overly optimistic assumptions?", "Does it address the constraints or requirements you mentioned?"]'::jsonb,
    '["What felt more reliable than your previous ChatGPT uses? Why?", "Which part of the output could you actually use in a real project meeting tomorrow?", "What one change in the prompt made the biggest difference in quality?"]'::jsonb,
    null,
    true
  ),
  (
    'w1d2',
    1,
    2,
    'Project Planning and Management',
    'Adding Constraints to Create Realistic Plans',
    'Learn how to add real-world limits (budget, time, resources) so AI stops suggesting ideal-world plans and becomes practical and reliable.',
    'Without explicit constraints, AI defaults to perfect scenarios. Clearly stating limits forces the model to respect reality, reducing over-optimism and hallucinations.',
    'Claude (claude.ai)',
    'Go to claude.ai and sign up free with email or Google. Free tier is generous. Start a new chat for each lesson. Claude is often more thoughtful with reasoning than basic ChatGPT.',
    'Act as a senior project manager experienced in development projects. Think step-by-step. Create a realistic project plan for [describe your project here]. Strictly respect these constraints: [list your real ones, e.g., total budget under X, maximum team of 8 people, must include quarterly donor reports, maximum timeline of 6 months]. Include phases, milestones, and basic resource allocation in a clean table format. If anything seems unrealistic under these constraints, clearly flag it.',
    '["List constraints clearly (bullets or numbered) inside the prompt - AI follows structured instructions better.", "Use strong phrases like \"Strictly respect these constraints\" and \"flag if unrealistic\" to reduce hallucinations.", "Start with only 3-4 key constraints; adding too many at once can make the AI say impossible.", "After the first response, follow up: \"Now create a version where one major risk materializes (e.g., key staff leaves for 2 weeks).\""]'::jsonb,
    'Fill in your actual constraints and run the prompt. Then iterate once with a follow-up question.',
    '["Does the plan stay within the constraints you set?", "Are flags or warnings shown when something does not fit?", "Is the table format easy to read and share at work?"]'::jsonb,
    '["How did adding constraints change the quality compared to Day 1?", "Was the output more usable for your real projects?", "What did you learn about making AI respect real-world limits?"]'::jsonb,
    'w1d1',
    true
  ),
  (
    'w1d3',
    1,
    3,
    'Project Planning and Management',
    'Risk Analysis Using Step-by-Step Reasoning (Chain-of-Thought)',
    'Learn the Chain-of-Thought (CoT) technique to get thorough, prioritized risk analysis instead of generic lists.',
    'Asking the AI to think step-by-step forces it to break down reasoning instead of jumping to conclusions. This greatly improves reliability when identifying risks.',
    'Claude (claude.ai)',
    'Use the same Claude account. Start a fresh chat.',
    'Act as a senior project manager with deep experience in development projects. Think step-by-step: First identify potential risks for [describe your project]. Then prioritize them by likelihood (low/medium/high) and impact (low/medium/high). Finally suggest practical mitigation strategies. Output in a clear table with columns: Risk, Likelihood, Impact, Mitigation. Consider common challenges in your local context.',
    '["The phrase \"Think step-by-step\" is called Chain-of-Thought (CoT) - it makes the AI reason more carefully and reduces hallucinations.", "Add your own local context if needed (e.g., weather, bureaucracy, funding delays).", "Request a specific table format - this makes outputs structured and easy to use.", "Follow up: \"Now rank these risks for my specific situation.\""]'::jsonb,
    'Run the prompt with your project, then ask one follow-up to refine it.',
    '["Are the risks realistic and specific to your context?", "Does the prioritization make sense?", "Are mitigations practical and actionable?"]'::jsonb,
    '["Did the step-by-step approach feel more reliable?", "Which risk surprised you or felt most useful?", "How will this help you in actual project planning?"]'::jsonb,
    'w1d2',
    true
  ),
  (
    'w1d4',
    1,
    4,
    'Project Planning and Management',
    'Resource Allocation and What-If Scenarios',
    'Learn to use AI for resource planning and quick scenario testing (what-if) to build flexible, resilient plans.',
    'What-if prompts turn AI into a simple simulator. Combined with constraints and Chain-of-Thought, this helps test plans under changes without manual rework.',
    'Microsoft Copilot (copilot.microsoft.com)',
    'Go to copilot.microsoft.com and sign in with a free Microsoft account. It works well with numbers and tables. You can also use it inside Excel if you have Microsoft 365.',
    'Act as an experienced project resource manager. For the project [describe it with key details], allocate resources (people, budget, time) across phases. Then run two what-if scenarios: 1) Budget reduced by 15%, 2) Timeline extended by 1 month due to delays. Output in clear tables and highlight the key adjustments needed. Think step-by-step.',
    '["What-if prompts are powerful for testing plans quickly.", "Be specific with numbers (percentages, months) for better accuracy.", "Combine with previous techniques: role, constraints, and \"think step-by-step\".", "Follow up: \"Summarize the main trade-offs in bullet points.\""]'::jsonb,
    'Run the base plan + at least one scenario. Try pasting a simple budget list if you have one.',
    '["Do the adjustments make logical sense?", "Are the tables clear and usable?", "Did the AI respect the original constraints?"]'::jsonb,
    '["How useful were the scenarios for thinking about risks?", "Could you use this approach in real funding proposals or team meetings?", "What prompt improvement would you make next time?"]'::jsonb,
    'w1d3',
    true
  ),
  (
    'w1d5',
    1,
    5,
    'Project Planning and Management',
    'Mapping Dependencies and Creating Milestones',
    'Learn to create clear dependency maps and milestone plans that show how tasks connect.',
    'Many projects fail due to poor dependency management. Explicit prompts asking for dependencies help AI produce logical sequences instead of isolated tasks.',
    'Claude',
    'Continue with Claude - new chat.',
    'Act as a senior project manager in development projects. Think step-by-step. For [describe your project], identify key tasks/phases and map their dependencies. Then define realistic milestones with deadlines. Output as: 1) A dependency table, 2) A milestone list with responsible parties and success criteria.',
    '["Ask for multiple output sections (tables + lists) to get well-organized results.", "Include responsible parties and success criteria to make milestones actionable."]'::jsonb,
    'Run the prompt and try to visualize the dependencies (you can copy the table into a simple drawing tool later).',
    '["Do the dependencies make logical sense?", "Are milestones achievable and measurable?"]'::jsonb,
    '["How does seeing dependencies change your view of the project?", "Would this help in team coordination?"]'::jsonb,
    'w1d4',
    true
  ),
  (
    'w1d6',
    1,
    6,
    'Project Planning and Management',
    'Stakeholder Mapping and Communication Planning',
    'Learn to identify stakeholders and plan how to communicate with them using AI.',
    'Good project plans include people management. Role-based prompting + structured output helps create balanced stakeholder analysis.',
    'Gemini (gemini.google.com)',
    'Go to gemini.google.com and sign in with Google account. It integrates well with Google Docs/Sheets if you want to export outputs.',
    'Act as an experienced project manager. For [describe your project], create a stakeholder map: list key stakeholders, their interests, influence level (low/medium/high), and potential concerns. Then suggest a simple communication plan (who, when, what format). Output in two clear tables.',
    '["Gemini is good at structured tables and works well with Google tools.", "Specify output format clearly to avoid messy responses."]'::jsonb,
    'Run the prompt using real or sample stakeholders from your work.',
    '["Does it capture both supporters and potential opponents?", "Is the communication plan practical?"]'::jsonb,
    '["How complete does the stakeholder view feel?", "Could you use this for donor or community meetings?"]'::jsonb,
    'w1d5',
    true
  ),
  (
    'w1d7',
    1,
    7,
    'Project Planning and Management',
    'Week 1 Review - Building a Full Integrated Project Plan',
    'Combine everything learned this week into one cohesive project plan and reflect on progress.',
    'Real skill comes from iterating and combining techniques (Role + Constraints + Chain-of-Thought + Scenarios + Output Format).',
    'Claude or your favorite tool from the week',
    'Use whichever tool felt most reliable this week.',
    'Act as a senior project manager in development projects. Using all best practices, create a complete integrated project plan for [describe your project] that includes: overview, phases with milestones, resource allocation, risks with mitigations, dependencies, and stakeholder communication. Think step-by-step and output in well-structured sections with tables where helpful.',
    '["Combine multiple techniques in one prompt for powerful results.", "Review and iterate on the full plan - this is how professionals use AI."]'::jsonb,
    'Create the full plan, then ask the AI one improvement question based on your real constraints.',
    '["Does the plan feel complete and realistic?", "Did it incorporate lessons from previous days?"]'::jsonb,
    '["What improved the most from Day 1 to Day 7?", "Which technique will you use most in your daily work?", "Overall, how has your view of AI reliability changed this week?"]'::jsonb,
    'w1d6',
    true
  );

commit;

-- Quick check
select id, week, day, title, is_active
from public.curriculum_lessons
where week = 1
order by day;
