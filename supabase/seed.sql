-- =============================================================================
-- Alt AI Labs — Seed Data
-- Run after all migrations. Idempotent (ON CONFLICT DO NOTHING).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Communities
-- ---------------------------------------------------------------------------
INSERT INTO communities (id, name, slug, description, accent_color, member_count) VALUES
  ('community-001', 'Alt AI Labs',     'alt-ai-labs',     'Learn AI by building real products. Weekly drops, challenges, and cash prizes.', 'blue',   127),
  ('community-002', 'Vibe Coders',     'vibe-coders',     'Ship apps with AI-assisted coding. Weekly vibe coding sessions with Cursor, Claude, and Copilot.', 'violet', 84),
  ('community-003', 'AI for Teachers', 'ai-for-teachers', 'Practical AI tools for educators. Build lesson planners, grading assistants, and feedback systems.', 'blue',   203)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Weekly Drops — Alt AI Labs (10 challenges)
-- ---------------------------------------------------------------------------
INSERT INTO weekly_drops (id, community_id, week_number, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, prize_per_entrant, min_entrants_for_prize, creator_name, creator_url, sponsor_name, sponsor_url, status, submissions_count) VALUES

-- Week 1 — LIVE — Nate Herk — AITIM HOLDING
(gen_random_uuid(), 'community-001', 1,
 '5 AI Workflows That Actually Sell in 2026',
 '5-ai-workflows-that-sell',
 'I built 500 AI workflows, and these are the 5 that actually sell in 2026. Learn the "boring" automations businesses actually pay for — and build one yourself.',
 'https://www.youtube.com/embed/Y3PcRp5RFzk', 14, 'beginner', true,
 E'Watch the video and build an AI Sales Agent using VSCode + Claude.\n\nIn this video, I break down 5 "boring" AI workflows that businesses actually want in 2026, based on building 500 AI workflows myself.\n\nTIMESTAMPS\n00:42 - Easiest Automation to Sell\n02:54 - The "Boring" Money Maker\n05:12 - Why Leads Don''t Convert\n07:40 - Hidden Money in Your CRM\n09:37 - The Stickiest Automation to Sell\n11:00 - The Most Profitable Automation I''ve seen\n11:50 - How to Sell Them?\n\nYour challenge: Pick ONE of the 5 workflows and build a working prototype using Claude + VSCode.',
 '["Working AI workflow prototype", "Demo video or live URL", "GitHub repo with source code", "Short writeup: which workflow you chose and why"]'::jsonb,
 '["Must use Claude API or Claude Code", "Build one of the 5 workflows from the video", "Submit before the deadline", "One submission per person"]'::jsonb,
 now() + interval '6 days',
 'Sponsored by AITIM HOLDING', 500, 0, 0,
 'Nate Herk', 'https://youtube.com/@nateherk',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 7),

-- Week 2 — LIVE — Nate Herk — AITIM HOLDING
(gen_random_uuid(), 'community-001', 2,
 'AI for Content Creation',
 'ai-for-content-creation',
 'Learn how to use AI to create, repurpose, and scale content across platforms. Build your own AI content pipeline.',
 'https://www.youtube.com/embed/tW40b122Rbs', 20, 'intermediate', true,
 E'Watch the video and build an AI-powered content creation system.\n\nYour challenge: Build a tool that takes a single piece of content and automatically repurposes it into multiple formats — social posts, email newsletters, video scripts, and more.',
 '["Working content repurposing tool", "Demo showing input → multiple outputs", "GitHub repo with source code", "Writeup explaining your approach"]'::jsonb,
 '["Must produce at least 3 different content formats from one input", "Any AI API allowed", "Submit before the deadline", "One submission per person"]'::jsonb,
 now() + interval '13 days',
 'Sponsored by AITIM HOLDING', 500, 0, 0,
 'Nate Herk', 'https://youtube.com/@nateherk',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 3),

-- Week 3 — LIVE — Nate Herk — AITIM HOLDING
(gen_random_uuid(), 'community-001', 3,
 'Build a Website with AI',
 'build-a-website-with-ai',
 'Use AI tools to design and build a complete, production-ready website from scratch. No templates — just you, AI, and a blank canvas.',
 'https://www.youtube.com/embed/86HM0RUWhCk', 25, 'beginner', true,
 E'Watch the video and build a complete website using AI.\n\nYour challenge: Build a professional, production-ready website for any business or project idea. Use AI to generate the design, write the copy, and ship it live.\n\nBonus points for:\n- Responsive design (mobile + desktop)\n- Real content (not lorem ipsum)\n- Deployed to a live URL\n- Creative use of AI in the build process',
 '["Live deployed website URL", "Screen recording of your build process", "GitHub repo with source code", "Brief writeup on how AI helped"]'::jsonb,
 '["Must use AI tools in the build process", "Website must be deployed and accessible", "Submit before the deadline", "One submission per person"]'::jsonb,
 now() + interval '20 days',
 'Sponsored by AITIM HOLDING', 500, 0, 0,
 'Nate Herk', 'https://youtube.com/@nateherk',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 2),

-- Week 4 — upcoming — Timur
(gen_random_uuid(), 'community-001', 4,
 'AI Executive Assistant in Claude Code',
 'ai-executive-assistant-claude-code',
 'Build a full AI executive assistant using Claude Code inside VS Code — email triage, calendar management, daily briefings, and task prioritization.',
 NULL, 45, 'intermediate', false,
 E'Build an AI executive assistant that handles your daily operations:\n\n- Email triage: categorize and draft responses\n- Calendar intelligence: surface scheduling conflicts\n- Daily briefing: auto-generate a morning summary\n- Task extraction: pull action items from emails and Slack',
 '["Working prototype with at least 2 features", "Demo video showing real usage", "Source code on GitHub"]'::jsonb,
 '["Must use Claude API or Claude Code", "Any additional stack allowed", "Submit before deadline"]'::jsonb,
 now() + interval '27 days',
 'Pool grows with every Pro builder who enters', 0, 50, 5,
 'Timur M.', NULL,
 NULL, NULL,
 'upcoming', 0),

-- Week 5 — upcoming — Timur
(gen_random_uuid(), 'community-001', 5,
 'Solo OS — Your Personal AI Operating System',
 'solo-os-personal-ai-operating-system',
 'Build "Solo OS" — a personal AI command center that manages your tasks, notes, calendar, and habits from a single dashboard powered by AI agents.',
 NULL, 50, 'advanced', false,
 E'Build your Solo OS — a personal operating system powered by AI:\n\n- Unified inbox: tasks, notes, calendar events in one feed\n- AI copilot: natural language commands\n- Habit tracker with AI coaching\n- Smart daily planner that auto-prioritizes',
 '["Working app (web or CLI)", "At least 3 integrated modules", "Demo video", "Source code"]'::jsonb,
 '["Any AI API allowed", "Must be a usable product, not a demo", "Submit before deadline"]'::jsonb,
 now() + interval '34 days',
 'Pool grows with every Pro builder who enters', 0, 75, 5,
 'Timur M.', NULL,
 NULL, NULL,
 'upcoming', 0),

-- Week 6 — upcoming — Timur
(gen_random_uuid(), 'community-001', 6,
 'AI YouTube Autopilot — Script to Upload',
 'ai-youtube-autopilot-script-to-upload',
 'Build an AI pipeline that generates video scripts, creates thumbnails, writes descriptions and tags — from a single topic input to YouTube-ready content.',
 NULL, 40, 'intermediate', false,
 E'Build an AI content pipeline for YouTube:\n\n- Topic → research → script generation\n- Auto-generate thumbnail concepts\n- SEO-optimized title, description, and tags\n- Content calendar: batch-plan 30 days of videos',
 '["Working pipeline (web app or script)", "Sample output for 3 different topics", "Source code"]'::jsonb,
 '["Any AI API allowed", "Must produce publishable output", "Submit before deadline"]'::jsonb,
 now() + interval '41 days',
 'Pool grows with every Pro builder who enters', 0, 50, 5,
 'Timur M.', NULL,
 NULL, NULL,
 'upcoming', 0),

-- Week 7 — upcoming — Timur
(gen_random_uuid(), 'community-001', 7,
 'Voice AI Receptionist for Small Business',
 'voice-ai-receptionist-small-business',
 'Build a voice AI agent that answers phone calls, books appointments, answers FAQs, and sends follow-up texts.',
 NULL, 45, 'advanced', false,
 E'Build a voice AI receptionist:\n\n- Answer inbound calls with natural voice\n- Understand caller intent: book appointment, ask question, leave message\n- Integrate with Google Calendar for real-time availability\n- Send SMS confirmations after booking',
 '["Working phone number that answers calls", "Demo video of a full call flow", "Architecture diagram", "Source code"]'::jsonb,
 '["Must handle at least 3 call scenarios", "Must use voice synthesis", "Submit before deadline"]'::jsonb,
 now() + interval '48 days',
 'Pool grows with every Pro builder who enters', 0, 75, 5,
 'Timur M.', NULL,
 NULL, NULL,
 'upcoming', 0),

-- Week 8 — upcoming — Timur
(gen_random_uuid(), 'community-001', 8,
 'Ship a SaaS MVP in One Weekend with AI',
 'saas-mvp-one-weekend-ai',
 'The ultimate challenge: build and launch a complete SaaS product in 48 hours using AI-assisted coding.',
 NULL, 55, 'advanced', false,
 E'Build a complete SaaS MVP in one weekend:\n\n- Landing page with waitlist or signup\n- User auth\n- Core feature that solves a real problem\n- Stripe payments\n- Dashboard with usage metrics\n- Deploy to production',
 '["Live deployed URL", "Working payments (test mode OK)", "Time-lapse or build log", "Source code"]'::jsonb,
 '["Must be built in 48 hours (honor system)", "Must have auth + payments + core feature", "Must be deployed and usable", "Submit before deadline"]'::jsonb,
 now() + interval '55 days',
 'Pool grows with every Pro builder who enters', 0, 100, 5,
 'Timur M.', NULL,
 NULL, NULL,
 'upcoming', 0),

-- Week 9 — LIVE — Dan Martell — AITIM HOLDING
(gen_random_uuid(), 'community-001', 9,
 'Zero-Code $10M AI Business Blueprint',
 'zero-code-10m-ai-business',
 'Watch Dan Martell break down how to build a $10M solo AI business with zero code — then prove it by launching your own AI micro-business in 7 days.',
 'https://www.youtube.com/embed/w-XPlC3a2oI', 18, 'intermediate', true,
 E'Dan Martell just dropped the playbook for building a $10M solo AI business without writing code.\n\nYour challenge: Launch a real AI micro-business in 7 days.\n\nWhat counts:\n- A real service that solves a real problem\n- At least 1 paying customer OR 10 waitlist signups\n- Built entirely with no-code/low-code + AI tools\n- A landing page that explains what you sell\n\nBonus points:\n- Revenue generated (even $1 counts!)\n- Customer testimonials\n- A breakdown of your entire stack + costs\n- A 60-second video pitch',
 '["Live landing page for your AI business", "Proof of customer traction", "Full stack breakdown (tools + cost)", "60-second video pitch", "Build process doc"]'::jsonb,
 '["Must use AI as core of product/service", "No custom code — no-code/low-code only", "Must have a live URL", "Must show proof of at least 1 customer interaction", "Submit before deadline"]'::jsonb,
 now() + interval '62 days',
 'Sponsored by AITIM HOLDING', 500, 0, 0,
 'Dan Martell', 'https://youtube.com/@danmartell',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 1),

-- Week 10 — LIVE — Dan Martell — AITIM HOLDING
(gen_random_uuid(), 'community-001', 10,
 'The AI Skills Gauntlet — Master All 9',
 'ai-skills-gauntlet-master-all-9',
 'Dan Martell says there are 9 AI skills that put you ahead of 99% of people. Prove you have them — build a project that showcases at least 5 in one shot.',
 'https://www.youtube.com/embed/BuwPnrMmhzQ', 15, 'advanced', true,
 E'Dan Martell listed the 9 AI skills that separate the top 1%.\n\nYour challenge: Build ONE project that demonstrates at least 5 of the 9 AI skills.\n\nThe 9 skills:\n1. Prompt Engineering\n2. AI Workflow Design\n3. Data Curation\n4. AI-Augmented Decision Making\n5. Human-AI Collaboration\n6. AI Tool Selection\n7. Output Validation\n8. AI Ethics & Safety\n9. Teaching AI to Others\n\nGet creative. The wilder the combo, the more points you score.',
 '["Working project (deployed URL or demo video)", "Scorecard: which 5+ skills and how", "Architecture diagram", "Source code or no-code breakdown", "Teach-it component (guide, video, or doc)"]'::jsonb,
 '["Must demonstrate at least 5 of 9 skills", "Must include self-assessment scorecard", "Any tech stack allowed", "Must include the teach component (skill #9)", "Submit before deadline"]'::jsonb,
 now() + interval '69 days',
 'Sponsored by AITIM HOLDING', 500, 0, 0,
 'Dan Martell', 'https://youtube.com/@danmartell',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 0)

ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Weekly Drops — Vibe Coders
-- ---------------------------------------------------------------------------
INSERT INTO weekly_drops (id, community_id, week_number, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_per_entrant, min_entrants_for_prize, creator_name, status, submissions_count) VALUES
(gen_random_uuid(), 'community-002', 1,
 'Ship a Landing Page in 30 Minutes',
 'ship-a-landing-page-in-30-minutes',
 'Use Cursor + Claude to build and deploy a landing page from a single prompt.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ', 32, 'beginner', true,
 'Vibe code a complete landing page for any product idea. Screen record your session.',
 '["Deployed URL", "Screen recording", "Total time spent"]'::jsonb,
 '["Must use AI-assisted coding", "Under 60 minutes", "Must be deployed"]'::jsonb,
 now() + interval '4 days',
 25, 5,
 'Timur M.',
 'live', 6)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Weekly Drops — AI for Teachers
-- ---------------------------------------------------------------------------
INSERT INTO weekly_drops (id, community_id, week_number, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_per_entrant, min_entrants_for_prize, creator_name, status, submissions_count) VALUES
(gen_random_uuid(), 'community-003', 1,
 'Build an AI Lesson Planner',
 'build-an-ai-lesson-planner',
 'Create a tool that generates week-long lesson plans from curriculum standards.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, 'beginner', true,
 'Build a lesson planner: input subject + grade → output structured weekly plan.',
 '["Working tool", "Sample output for 3 subjects", "Video demo"]'::jsonb,
 '["Must be usable by non-technical teachers", "Any AI API allowed"]'::jsonb,
 now() + interval '6 days',
 15, 5,
 'Timur M.',
 'live', 11)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Groups (community-scoped)
-- ---------------------------------------------------------------------------
INSERT INTO groups (id, name, slug, description, visibility, community_id) VALUES
  ('30000000-0000-0000-0000-000000000001', 'General Builders',    'general-builders',    'The main community group for all AI builders.', 'public',  'community-001'),
  ('30000000-0000-0000-0000-000000000002', 'Pro Builders Circle', 'pro-builders-circle', 'Exclusive group for paid members. Deep dives and direct feedback.', 'private', 'community-001'),
  ('30000000-0000-0000-0000-000000000003', 'AI Sales Builders',   'ai-sales-builders',   'Focused on building AI-powered sales tools and automations.', 'public',  'community-001')
ON CONFLICT DO NOTHING;
