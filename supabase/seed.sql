-- =============================================================================
-- Alt AI Labs - Seed Data
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Tracks
-- ---------------------------------------------------------------------------
INSERT INTO tracks (id, title, slug, description, icon, color, order_index, is_free) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Beginner AI Builder', 'beginner-ai-builder', 'Start your AI building journey from scratch.', 'Sparkles', '#22c55e', 1, true),
  ('00000000-0000-0000-0000-000000000002', 'Claude + VS Code Builds', 'claude-vscode-builds', 'Build powerful tools using Claude and VS Code.', 'Code', '#3b82f6', 2, false),
  ('00000000-0000-0000-0000-000000000003', 'AI Sales Systems', 'ai-sales-systems', 'Automate and supercharge your sales pipeline with AI.', 'TrendingUp', '#f59e0b', 3, false),
  ('00000000-0000-0000-0000-000000000004', 'AI Operator Systems', 'ai-operator-systems', 'Build AI-driven operational workflows and automations.', 'Settings', '#8b5cf6', 4, false),
  ('00000000-0000-0000-0000-000000000005', 'Personal Productivity Agents', 'personal-productivity-agents', 'Create AI agents that boost your personal productivity.', 'Zap', '#ec4899', 5, false)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Lessons
-- ---------------------------------------------------------------------------
INSERT INTO lessons (id, track_id, title, slug, short_description, full_content, difficulty, duration_minutes, status, order_index, is_free, key_outcomes) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Executive Assistant with Claude + VS Code',
    'executive-assistant-claude-vscode',
    'Build a fully functional executive assistant powered by Claude, right inside VS Code.',
    E'# Executive Assistant with Claude + VS Code\n\nIn this lesson you will learn how to build an AI-powered executive assistant that lives inside your VS Code editor.\n\n## What You Will Build\n\nA Claude-powered assistant that can:\n- Manage your calendar and schedule\n- Draft and summarise emails\n- Create meeting agendas and follow-ups\n- Research topics on demand\n\n## Prerequisites\n\n- VS Code installed\n- Claude API key\n- Basic JavaScript / TypeScript knowledge\n\n## Step 1 - Set Up the Project\n\nCreate a new directory and initialise the project:\n\n```bash\nmkdir executive-assistant && cd executive-assistant\nnpm init -y\nnpm install @anthropic-ai/sdk dotenv\n```\n\n## Step 2 - Configure Claude\n\nCreate a `.env` file with your API key and wire up the Anthropic client.\n\n## Step 3 - Build the Core Loop\n\nImplement a conversational loop that accepts user instructions and returns structured output.\n\n## Step 4 - Add Tool Use\n\nLeverage Claude tool use to let the assistant call calendar and email APIs.\n\n## Summary\n\nYou now have a working executive assistant inside VS Code. Extend it by adding more tools and integrating with your favourite productivity apps.',
    'intermediate',
    45,
    'published',
    1,
    false,
    '["Build a Claude-powered assistant in VS Code", "Use tool calling for calendar and email", "Structure conversational AI loops"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'AI Sales Agent',
    'ai-sales-agent',
    'Create an AI agent that qualifies leads and automates outreach.',
    E'# AI Sales Agent\n\nLearn how to build an autonomous sales agent that qualifies inbound leads, enriches contact data, and drafts personalised outreach.\n\n## What You Will Build\n\nAn AI sales agent that:\n- Scores and qualifies inbound leads\n- Enriches leads with public data\n- Drafts personalised cold emails\n- Logs activity to your CRM\n\n## Prerequisites\n\n- Node.js 18+\n- Claude API key\n- Basic understanding of REST APIs\n\n## Step 1 - Define the Lead Schema\n\nCreate a typed schema for leads including name, company, role, score, and status.\n\n## Step 2 - Build the Qualification Engine\n\nUse Claude to analyse lead data and return a qualification score with reasoning.\n\n## Step 3 - Enrich with Public Data\n\nPull publicly available company info to give Claude more context.\n\n## Step 4 - Draft Outreach\n\nGenerate personalised email drafts based on the enriched lead profile.\n\n## Step 5 - CRM Integration\n\nPush qualified leads and email drafts into your CRM via API.\n\n## Summary\n\nYou have built an end-to-end AI sales agent. Next steps: add follow-up sequences and A/B testing on email templates.',
    'advanced',
    60,
    'published',
    1,
    false,
    '["Build an AI lead qualification engine", "Automate personalised outreach", "Integrate with CRM systems"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    'AI Support Inbox Triage',
    'ai-support-inbox-triage',
    'Automatically categorise and prioritise support tickets using AI.',
    NULL,
    'intermediate',
    35,
    'coming_soon',
    1,
    false,
    '["Categorise support tickets with AI", "Auto-prioritise by urgency", "Route tickets to the right team"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000003',
    'Lead Capture + CRM Updater',
    'lead-capture-crm-updater',
    'Build a system that captures leads from multiple sources and keeps your CRM in sync.',
    NULL,
    'beginner',
    30,
    'coming_soon',
    2,
    false,
    '["Capture leads from forms and chat", "Sync data to your CRM automatically", "Deduplicate and enrich contacts"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    'Content Repurposing Agent',
    'content-repurposing-agent',
    'Turn one piece of content into multiple formats automatically.',
    NULL,
    'intermediate',
    40,
    'coming_soon',
    1,
    false,
    '["Repurpose blog posts into social threads", "Generate video scripts from articles", "Maintain consistent brand voice"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000005',
    'Solo Founder Dashboard Agent',
    'solo-founder-dashboard-agent',
    'Build a personal dashboard agent that aggregates metrics across all your tools.',
    NULL,
    'advanced',
    50,
    'coming_soon',
    2,
    false,
    '["Aggregate metrics from multiple SaaS tools", "AI-generated daily briefings", "Anomaly detection and alerts"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000004',
    'Telegram Booking Agent',
    'telegram-booking-agent',
    'Create a Telegram bot that handles appointment booking and reminders.',
    NULL,
    'intermediate',
    35,
    'coming_soon',
    2,
    false,
    '["Build a Telegram booking bot", "Integrate with calendar APIs", "Send automated reminders"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000004',
    'Internal Ops Automation',
    'internal-ops-automation',
    'Automate repetitive internal operations with AI-powered workflows.',
    NULL,
    'advanced',
    55,
    'coming_soon',
    3,
    false,
    '["Automate internal reporting", "AI-driven approval workflows", "Reduce manual ops overhead"]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Challenges
-- ---------------------------------------------------------------------------
INSERT INTO challenges (id, title, slug, short_description, build_brief, deliverables, rules, deadline, prize_description, prize_amount, status, visibility) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Build Your First AI Assistant',
    'build-your-first-ai-assistant',
    'Create any AI-powered assistant using Claude or another LLM.',
    'Build a functional AI assistant that solves a real problem. It can be a chatbot, a CLI tool, a browser extension, or anything else. The key is that it must use an LLM under the hood and deliver genuine value.',
    '["A working demo (video or live link)", "Source code in a public repo", "A short write-up explaining your approach"]'::jsonb,
    '["Must use an LLM API (Claude, GPT, etc.)", "Solo or team of up to 3", "Submissions must be original work"]'::jsonb,
    NOW() + INTERVAL '7 days',
    'Bragging rights and a featured spot on the leaderboard.',
    0,
    'active',
    'public'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Sales Pipeline Automator',
    'sales-pipeline-automator',
    'Automate a real sales workflow end-to-end with AI.',
    'Design and build an AI-powered sales pipeline automation. Your system should handle at least two stages of the pipeline (e.g., lead capture + qualification, or outreach + follow-up). Bonus points for CRM integration.',
    '["Working prototype with demo video", "Architecture diagram", "Source code"]'::jsonb,
    '["Must include at least two pipeline stages", "Must use AI for decision-making, not just templates", "Paid members only"]'::jsonb,
    NOW() + INTERVAL '14 days',
    '$500 cash prize for the winner.',
    500,
    'active',
    'paid_only'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Ops Automation Sprint',
    'ops-automation-sprint',
    'Build an internal operations automation in one weekend.',
    'Pick an internal ops pain point (reporting, approvals, data entry, scheduling) and build an AI-powered solution in a weekend sprint. Speed and creativity count.',
    '["Working tool or script", "Before/after comparison", "Brief write-up"]'::jsonb,
    '["Must be built within 48 hours of the challenge start", "Open to everyone", "AI must be core to the solution"]'::jsonb,
    NOW() + INTERVAL '21 days',
    '$250 cash prize for the most creative solution.',
    250,
    'upcoming',
    'public'
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Best AI Build of the Month',
    'best-ai-build-of-the-month',
    'Monthly showcase of the best AI projects from the community.',
    'Submit your best AI build from this month. Any project counts - tools, agents, automations, apps. The community and judges will pick the top three.',
    '["Live demo or video walkthrough", "Source code or detailed explanation", "Impact statement"]'::jsonb,
    '["One submission per person", "Project must have been built or significantly updated this month", "All skill levels welcome"]'::jsonb,
    NOW() - INTERVAL '3 days',
    '$1000 in total prizes across 1st, 2nd, and 3rd place.',
    1000,
    'completed',
    'public'
  )
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Groups
-- ---------------------------------------------------------------------------
INSERT INTO groups (id, name, slug, description, visibility) VALUES
  ('30000000-0000-0000-0000-000000000001', 'General Builders', 'general-builders', 'The main community group for all AI builders. Share your projects, ask questions, and connect with others.', 'public'),
  ('30000000-0000-0000-0000-000000000002', 'Pro Builders Circle', 'pro-builders-circle', 'An exclusive group for paid members. Deep dives, early access, and direct feedback from mentors.', 'private'),
  ('30000000-0000-0000-0000-000000000003', 'AI Sales Builders', 'ai-sales-builders', 'Focused on building AI-powered sales tools and automations. Share strategies and templates.', 'public')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Prizes for "Best AI Build of the Month" (challenge 4)
-- ---------------------------------------------------------------------------
INSERT INTO prizes (challenge_id, place, description, amount) VALUES
  ('20000000-0000-0000-0000-000000000004', 1, '1st Place - Best AI Build of the Month', 500),
  ('20000000-0000-0000-0000-000000000004', 2, '2nd Place - Best AI Build of the Month', 300),
  ('20000000-0000-0000-0000-000000000004', 3, '3rd Place - Best AI Build of the Month', 200)
ON CONFLICT DO NOTHING;
