-- ═══════════════════════════════════════════════════════════════
-- Alt AI Labs — Seed Data
-- Run after db-init.sql. Idempotent (ON CONFLICT DO NOTHING).
-- ═══════════════════════════════════════════════════════════════

-- ── Communities ────────────────────────────────────────────────
INSERT INTO communities (id, name, slug, description, accent_color, owner_id, member_count) VALUES
  ('community-001', 'Alt AI Labs',     'alt-ai-labs',     'Learn AI by building real products. Drops, challenges, and cash prizes.', 'green',  'admin', 127),
  ('community-002', 'Vibe Coders',     'vibe-coders',     'Ship apps with AI-assisted coding. Vibe coding sessions with Cursor, Claude, and Copilot.', 'violet', 'admin', 84),
  ('community-003', 'AI for Teachers', 'ai-for-teachers', 'Practical AI tools for educators. Build lesson planners, grading assistants, and feedback systems.', 'blue',   'admin', 203)
ON CONFLICT DO NOTHING;

-- ── Drops — Alt AI Labs ────────────────────────────────────────

-- LIVE — Nate Herk / AITIM HOLDING
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, creator_name, creator_url, sponsor_name, sponsor_url, status, submissions_count) VALUES
('drop-001', 'community-001',
 '5 AI Workflows That Actually Sell in 2026',
 '5-ai-workflows-that-sell',
 'I built 500 AI workflows, and these are the 5 that actually sell in 2026.',
 'https://www.youtube.com/embed/Y3PcRp5RFzk', 14, 'beginner', true,
 E'Watch the video and build an AI Sales Agent using VSCode + Claude.\n\nPick ONE of the 5 workflows and build a working prototype using Claude + VSCode.',
 '["Working AI workflow prototype", "Demo video or live URL", "GitHub repo with source code", "Short writeup: which workflow you chose and why"]',
 '["Must use Claude API or Claude Code", "Build one of the 5 workflows from the video", "Submit before the deadline", "One submission per person"]',
 NOW() + INTERVAL '6 days',
 'Sponsored by AITIM HOLDING', 500,
 'Nate Herk', 'https://youtube.com/@nateherk',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 7)
ON CONFLICT DO NOTHING;

-- LIVE — Nate Herk / AITIM HOLDING
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, creator_name, creator_url, sponsor_name, sponsor_url, status, submissions_count) VALUES
('drop-002', 'community-001',
 'AI for Content Creation',
 'ai-for-content-creation',
 'Learn how to use AI to create, repurpose, and scale content across platforms.',
 'https://www.youtube.com/embed/tW40b122Rbs', 20, 'intermediate', true,
 E'Build an AI-powered content creation system that repurposes content into multiple formats.',
 '["Working content repurposing tool", "Demo showing input to multiple outputs", "GitHub repo with source code", "Writeup explaining your approach"]',
 '["Must produce at least 3 different content formats from one input", "Any AI API allowed", "Submit before the deadline", "One submission per person"]',
 NOW() + INTERVAL '13 days',
 'Sponsored by AITIM HOLDING', 500,
 'Nate Herk', 'https://youtube.com/@nateherk',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 3)
ON CONFLICT DO NOTHING;

-- LIVE — Nate Herk / AITIM HOLDING
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, creator_name, creator_url, sponsor_name, sponsor_url, status, submissions_count) VALUES
('drop-003', 'community-001',
 'Build a Website with AI',
 'build-a-website-with-ai',
 'Use AI tools to design and build a complete, production-ready website from scratch.',
 'https://www.youtube.com/embed/86HM0RUWhCk', 25, 'beginner', true,
 E'Build a professional website using AI. Deploy it live.\n\nBonus points for responsive design, real content, and creative use of AI.',
 '["Live deployed website URL", "Screen recording of your build process", "GitHub repo with source code", "Brief writeup on how AI helped"]',
 '["Must use AI tools in the build process", "Website must be deployed and accessible", "Submit before the deadline", "One submission per person"]',
 NOW() + INTERVAL '20 days',
 'Sponsored by AITIM HOLDING', 500,
 'Nate Herk', 'https://youtube.com/@nateherk',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 2)
ON CONFLICT DO NOTHING;

-- upcoming — Timur
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_per_entrant, min_entrants_for_prize, creator_name, status) VALUES
('drop-004', 'community-001',
 'AI Executive Assistant in Claude Code',
 'ai-executive-assistant-claude-code',
 'Build a full AI executive assistant using Claude Code — email triage, calendar management, daily briefings, and task prioritization.',
 NULL, 45, 'intermediate', false,
 E'Build an AI executive assistant that handles daily operations:\n\n- Email triage and draft responses\n- Calendar intelligence and scheduling\n- Daily briefing auto-generation\n- Task extraction from emails and Slack',
 '["Working prototype with at least 2 features", "Demo video showing real usage", "Source code on GitHub"]',
 '["Must use Claude API or Claude Code", "Any additional stack allowed", "Submit before deadline"]',
 NOW() + INTERVAL '27 days',
 'Pool grows with every Pro builder who enters', 50, 5,
 'Timur M.', 'upcoming')
ON CONFLICT DO NOTHING;

-- upcoming — Timur
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_per_entrant, min_entrants_for_prize, creator_name, status) VALUES
('drop-005', 'community-001',
 'Solo OS — Your Personal AI Operating System',
 'solo-os-personal-ai-operating-system',
 'Build "Solo OS" — a personal AI command center that manages your tasks, notes, calendar, and habits.',
 NULL, 50, 'advanced', false,
 E'Build your Solo OS — a personal operating system powered by AI:\n\n- Unified inbox: tasks, notes, calendar events\n- AI copilot: natural language commands\n- Habit tracker with AI coaching\n- Smart daily planner that auto-prioritizes',
 '["Working app (web or CLI)", "At least 3 integrated modules", "Demo video", "Source code"]',
 '["Any AI API allowed", "Must be a usable product, not a demo", "Submit before deadline"]',
 NOW() + INTERVAL '34 days',
 'Pool grows with every Pro builder who enters', 75, 5,
 'Timur M.', 'upcoming')
ON CONFLICT DO NOTHING;

-- upcoming — Timur
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_per_entrant, min_entrants_for_prize, creator_name, status) VALUES
('drop-006', 'community-001',
 'AI YouTube Autopilot — Script to Upload',
 'ai-youtube-autopilot-script-to-upload',
 'Build an AI pipeline that generates video scripts, thumbnails, descriptions and tags — from topic to YouTube-ready.',
 NULL, 40, 'intermediate', false,
 E'Build an AI content pipeline for YouTube:\n\n- Topic → research → script generation\n- Auto-generate thumbnail concepts\n- SEO-optimized title, description, and tags\n- Content calendar: batch-plan 30 days of videos',
 '["Working pipeline (web app or script)", "Sample output for 3 different topics", "Source code"]',
 '["Any AI API allowed", "Must produce publishable output", "Submit before deadline"]',
 NOW() + INTERVAL '41 days',
 'Pool grows with every Pro builder who enters', 50, 5,
 'Timur M.', 'upcoming')
ON CONFLICT DO NOTHING;

-- upcoming — Timur
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_per_entrant, min_entrants_for_prize, creator_name, status) VALUES
('drop-007', 'community-001',
 'Voice AI Receptionist for Small Business',
 'voice-ai-receptionist-small-business',
 'Build a voice AI agent that answers phone calls, books appointments, answers FAQs, and sends follow-up texts.',
 NULL, 45, 'advanced', false,
 E'Build a voice AI receptionist:\n\n- Answer inbound calls with natural voice\n- Understand caller intent: book, ask, leave message\n- Google Calendar integration for availability\n- SMS confirmations after booking',
 '["Working phone number that answers calls", "Demo video of a full call flow", "Architecture diagram", "Source code"]',
 '["Must handle at least 3 call scenarios", "Must use voice synthesis", "Submit before deadline"]',
 NOW() + INTERVAL '48 days',
 'Pool grows with every Pro builder who enters', 75, 5,
 'Timur M.', 'upcoming')
ON CONFLICT DO NOTHING;

-- upcoming — Timur
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_per_entrant, min_entrants_for_prize, creator_name, status) VALUES
('drop-008', 'community-001',
 'Ship a SaaS MVP in One Weekend with AI',
 'saas-mvp-one-weekend-ai',
 'The ultimate challenge: build and launch a complete SaaS product in 48 hours using AI-assisted coding.',
 NULL, 55, 'advanced', false,
 E'Build a complete SaaS MVP in one weekend:\n\n- Landing page with waitlist or signup\n- User auth\n- Core feature that solves a real problem\n- Stripe payments\n- Dashboard with usage metrics\n- Deploy to production',
 '["Live deployed URL", "Working payments (test mode OK)", "Time-lapse or build log", "Source code"]',
 '["Must be built in 48 hours (honor system)", "Must have auth + payments + core feature", "Must be deployed and usable", "Submit before deadline"]',
 NOW() + INTERVAL '55 days',
 'Pool grows with every Pro builder who enters', 100, 5,
 'Timur M.', 'upcoming')
ON CONFLICT DO NOTHING;

-- LIVE — Dan Martell / AITIM HOLDING
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, creator_name, creator_url, sponsor_name, sponsor_url, status, submissions_count) VALUES
('drop-009', 'community-001',
 'Zero-Code $10M AI Business Blueprint',
 'zero-code-10m-ai-business',
 'Dan Martell breaks down how to build a $10M solo AI business with zero code — then prove it by launching your own AI micro-business in 7 days.',
 'https://www.youtube.com/embed/w-XPlC3a2oI', 18, 'intermediate', true,
 E'Launch a real AI micro-business in 7 days using only no-code tools + AI.\n\nWhat counts:\n- A real service that solves a real problem\n- At least 1 paying customer OR 10 waitlist signups\n- Built entirely with no-code/low-code + AI tools\n- A landing page that explains what you sell',
 '["Live landing page for your AI business", "Proof of customer traction", "Full stack breakdown (tools + cost)", "60-second video pitch", "Build process doc"]',
 '["Must use AI as core of product/service", "No custom code — no-code/low-code only", "Must have a live URL", "Must show proof of at least 1 customer interaction", "Submit before deadline"]',
 NOW() + INTERVAL '62 days',
 'Sponsored by AITIM HOLDING', 500,
 'Dan Martell', 'https://youtube.com/@danmartell',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 1)
ON CONFLICT DO NOTHING;

-- LIVE — Dan Martell / AITIM HOLDING
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_description, prize_amount, creator_name, creator_url, sponsor_name, sponsor_url, status, submissions_count) VALUES
('drop-010', 'community-001',
 'The AI Skills Gauntlet — Master All 9',
 'ai-skills-gauntlet-master-all-9',
 'Dan Martell says 9 AI skills put you ahead of 99% of people. Build a project that showcases at least 5 in one shot.',
 'https://www.youtube.com/embed/BuwPnrMmhzQ', 15, 'advanced', true,
 E'Build ONE project that demonstrates at least 5 of the 9 AI skills Dan Martell identified.\n\nThe 9 skills:\n1. Prompt Engineering\n2. AI Workflow Design\n3. Data Curation\n4. AI-Augmented Decision Making\n5. Human-AI Collaboration\n6. AI Tool Selection\n7. Output Validation\n8. AI Ethics & Safety\n9. Teaching AI to Others\n\nThe most creative combo wins.',
 '["Working project (deployed URL or demo video)", "Scorecard: which 5+ skills and how", "Architecture diagram", "Source code or no-code breakdown", "Teach-it component (guide, video, or doc)"]',
 '["Must demonstrate at least 5 of 9 skills", "Must include self-assessment scorecard", "Any tech stack allowed", "Must include the teach component (skill #9)", "Submit before deadline"]',
 NOW() + INTERVAL '69 days',
 'Sponsored by AITIM HOLDING', 500,
 'Dan Martell', 'https://youtube.com/@danmartell',
 'AITIM HOLDING', 'https://aitim.holding',
 'live', 0)
ON CONFLICT DO NOTHING;

-- ── Drops — Vibe Coders ───────────────────────────────────────
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_per_entrant, min_entrants_for_prize, creator_name, status, submissions_count) VALUES
('drop-vc-001', 'community-002',
 'Ship a Landing Page in 30 Minutes',
 'ship-a-landing-page-in-30-minutes',
 'Use Cursor + Claude to build and deploy a landing page from a single prompt.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ', 32, 'beginner', true,
 'Vibe code a complete landing page for any product idea. Screen record your session.',
 '["Deployed URL", "Screen recording", "Total time spent"]',
 '["Must use AI-assisted coding", "Under 60 minutes", "Must be deployed"]',
 NOW() + INTERVAL '4 days',
 25, 5,
 'Timur M.', 'live', 6)
ON CONFLICT DO NOTHING;

-- ── Drops — AI for Teachers ───────────────────────────────────
INSERT INTO drops (id, community_id, title, slug, description, video_url, duration_minutes, difficulty, is_free, challenge_brief, challenge_deliverables, challenge_rules, challenge_deadline, prize_per_entrant, min_entrants_for_prize, creator_name, status, submissions_count) VALUES
('drop-at-001', 'community-003',
 'Build an AI Lesson Planner',
 'build-an-ai-lesson-planner',
 'Create a tool that generates week-long lesson plans from curriculum standards.',
 'https://www.youtube.com/embed/dQw4w9WgXcQ', 25, 'beginner', true,
 'Build a lesson planner: input subject + grade → output structured weekly plan.',
 '["Working tool", "Sample output for 3 subjects", "Video demo"]',
 '["Must be usable by non-technical teachers", "Any AI API allowed"]',
 NOW() + INTERVAL '6 days',
 15, 5,
 'Timur M.', 'live', 11)
ON CONFLICT DO NOTHING;

-- ── Groups ─────────────────────────────────────────────────────
INSERT INTO groups (id, community_id, name, slug, description, visibility) VALUES
  (gen_random_uuid(), 'community-001', 'General Builders',    'general-builders',    'The main community space. Share progress, ask questions, connect.',                    'public'),
  (gen_random_uuid(), 'community-001', 'Pro Builders Circle', 'pro-builders-circle', 'Exclusive group for Pro members. Deep dives, accountability, direct access.',           'private'),
  (gen_random_uuid(), 'community-001', 'AI Sales Builders',   'ai-sales-builders',   'Focused on building AI-powered sales tools and automations.',                           'public')
ON CONFLICT DO NOTHING;
