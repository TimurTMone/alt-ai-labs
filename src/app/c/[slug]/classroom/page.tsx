'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { PreviewBanner } from '@/components/ui/preview-banner'
import { useCommunityRequired } from "@/lib/community-context"
import {
  BookOpen, ChevronDown, ChevronRight, Play, FileText, Download, Lock,
  CheckCircle2, Rocket, HelpCircle, Megaphone, Wrench, Star, Clock,
  ExternalLink, Copy, Sparkles, FolderOpen
} from 'lucide-react'

type Lesson = {
  id: string
  title: string
  type: 'video' | 'doc' | 'template' | 'link'
  duration?: string
  completed?: boolean
  locked?: boolean
  url?: string
  description?: string
}

type Module = {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  color: string
  lessons: Lesson[]
  defaultOpen?: boolean
}

const TYPE_ICONS = {
  video: Play,
  doc: FileText,
  template: Download,
  link: ExternalLink,
}

const TYPE_LABELS = {
  video: 'Video',
  doc: 'Doc',
  template: 'Template',
  link: 'Link',
}

function ModuleCard({ module }: { module: Module }) {
  const [open, setOpen] = useState(module.defaultOpen ?? false)
  const completedCount = module.lessons.filter(l => l.completed).length
  const totalCount = module.lessons.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-white/[0.1]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left group"
      >
        <div className={`w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${module.color} shrink-0 group-hover:bg-white/[0.06] transition-colors`}>
          {module.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[15px] text-white">{module.title}</h3>
            <span className="text-[11px] text-zinc-600">{totalCount} items</span>
          </div>
          <p className="text-[12px] text-zinc-500 mt-0.5">{module.description}</p>
          {completedCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden max-w-[160px]">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[10px] text-zinc-600">{completedCount}/{totalCount}</span>
            </div>
          )}
        </div>
        <div className="shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.04]">
          {module.lessons.map((lesson, i) => {
            const Icon = TYPE_ICONS[lesson.type]
            return (
              <div
                key={lesson.id}
                className={`flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.03] last:border-0 transition-colors ${
                  lesson.locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/[0.02] cursor-pointer'
                }`}
              >
                {/* Status */}
                <div className="w-6 flex items-center justify-center shrink-0">
                  {lesson.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  ) : lesson.locked ? (
                    <Lock className="w-3.5 h-3.5 text-zinc-600" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/[0.15]" />
                  )}
                </div>

                {/* Type icon */}
                <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 ${
                  lesson.type === 'video' ? 'text-blue-400' :
                  lesson.type === 'template' ? 'text-amber-400' :
                  lesson.type === 'link' ? 'text-violet-400' :
                  'text-zinc-400'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium truncate ${lesson.completed ? 'text-zinc-500' : 'text-white'}`}>
                    {lesson.title}
                  </p>
                  {lesson.description && (
                    <p className="text-[11px] text-zinc-600 mt-0.5 truncate">{lesson.description}</p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 shrink-0">
                  {lesson.duration && (
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.duration}
                    </span>
                  )}
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${
                    lesson.type === 'video' ? 'bg-blue-500/10 text-blue-400 border-blue-500/15' :
                    lesson.type === 'template' ? 'bg-amber-500/10 text-amber-400 border-amber-500/15' :
                    lesson.type === 'link' ? 'bg-violet-500/10 text-violet-400 border-violet-500/15' :
                    'bg-white/[0.04] text-zinc-500 border-white/[0.06]'
                  }`}>
                    {TYPE_LABELS[lesson.type]}
                  </span>
                  {lesson.locked && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">PRO</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ClassroomPage() {
  const community = useCommunityRequired()

  const modules: Module[] = [
    {
      id: 'onboarding',
      title: 'Getting Started',
      icon: <Rocket className="w-5 h-5" />,
      description: 'Everything you need to start building with AI',
      color: 'text-blue-400',
      defaultOpen: true,
      lessons: [
        { id: 'ob-1', title: 'Welcome to Alt AI Labs', type: 'video', duration: '3 min', completed: true, description: 'Quick intro — how everything works' },
        { id: 'ob-2', title: 'How Drops Work (Watch → Build → Ship)', type: 'doc', duration: '2 min read', completed: true, description: 'The weekly cycle explained' },
        { id: 'ob-3', title: 'Set Up Your Dev Environment', type: 'doc', duration: '5 min read', completed: false, description: 'Node.js, VS Code, Claude API key, Vercel account' },
        { id: 'ob-4', title: 'Your First API Call to Claude', type: 'video', duration: '8 min', completed: false, description: 'Go from zero to working AI response in minutes' },
        { id: 'ob-5', title: 'How to Submit Your Build', type: 'doc', duration: '2 min read', completed: false, description: 'Step-by-step submission guide' },
        { id: 'ob-6', title: 'Join the Community Chat', type: 'link', completed: false, description: 'Introduce yourself and connect with builders' },
      ],
    },
    {
      id: 'templates',
      title: 'Templates & Starter Kits',
      icon: <Wrench className="w-5 h-5" />,
      description: 'Clone, customize, and ship faster',
      color: 'text-amber-400',
      lessons: [
        { id: 'tp-1', title: 'Next.js + Claude AI Starter', type: 'template', description: 'Full-stack starter with Claude API, auth, and Tailwind' },
        { id: 'tp-2', title: 'AI Chatbot Template', type: 'template', description: 'Streaming chat UI with conversation history and tool use' },
        { id: 'tp-3', title: 'AI Agent Framework', type: 'template', description: 'Multi-step agent with tool calling, memory, and error handling', locked: true },
        { id: 'tp-4', title: 'SaaS MVP Boilerplate', type: 'template', description: 'Auth + Stripe + dashboard + landing page — ready to customize', locked: true },
        { id: 'tp-5', title: 'Voice AI Starter (Twilio + ElevenLabs)', type: 'template', description: 'Inbound call handler with voice synthesis', locked: true },
        { id: 'tp-6', title: 'RAG Pipeline Template', type: 'template', description: 'Document ingestion, chunking, embedding, and semantic search', locked: true },
      ],
    },
    {
      id: 'guides',
      title: 'Builder Guides',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Deep dives on AI concepts and patterns',
      color: 'text-blue-400',
      lessons: [
        { id: 'gd-1', title: 'Prompt Engineering That Actually Works', type: 'doc', duration: '10 min read', description: 'Patterns, anti-patterns, and real examples' },
        { id: 'gd-2', title: 'Tool Use & Function Calling Explained', type: 'video', duration: '15 min', description: 'How to give AI hands — connect it to APIs and databases' },
        { id: 'gd-3', title: 'Streaming Responses in Next.js', type: 'doc', duration: '8 min read', description: 'Server-sent events, edge functions, and real-time UI' },
        { id: 'gd-4', title: 'Building Multi-Step AI Agents', type: 'video', duration: '22 min', description: 'Planning, execution, error recovery, and human-in-the-loop', locked: true },
        { id: 'gd-5', title: 'RAG: When and How to Use It', type: 'doc', duration: '12 min read', description: 'Retrieval-augmented generation for real-world apps', locked: true },
        { id: 'gd-6', title: 'Deploying AI Apps to Production', type: 'video', duration: '18 min', description: 'Vercel, rate limiting, error handling, monitoring', locked: true },
      ],
    },
    {
      id: 'announcements',
      title: 'Announcements',
      icon: <Megaphone className="w-5 h-5" />,
      description: 'Updates, changelog, and what\'s coming next',
      color: 'text-pink-400',
      lessons: [
        { id: 'an-1', title: 'Week 3 Drop is LIVE — AI Executive Assistant', type: 'doc', duration: 'Mar 21', description: '$500 prize. Build with Claude Code + VS Code.' },
        { id: 'an-2', title: 'New: Solo OS Drop Coming Week 4', type: 'doc', duration: 'Mar 19', description: 'Build your personal AI operating system. $750 prize.' },
        { id: 'an-3', title: 'Leaderboard Levels Are Here', type: 'doc', duration: 'Mar 17', description: '9 levels from Prompt Rookie to Founding Builder. Start climbing.' },
        { id: 'an-4', title: 'Pro Builder Tier Launching Soon', type: 'doc', duration: 'Mar 15', description: '$29/mo for all drops, templates, cash prizes, and private groups.' },
      ],
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Common questions answered',
      color: 'text-cyan-400',
      lessons: [
        { id: 'fq-1', title: 'Do I need to know how to code?', type: 'doc', description: 'Basic JavaScript/Python helps, but beginners are welcome. Start with Week 1.' },
        { id: 'fq-2', title: 'What AI tools/APIs do I need?', type: 'doc', description: 'Claude API (free tier works), Vercel (free), and a code editor. That\'s it.' },
        { id: 'fq-3', title: 'How do prizes work?', type: 'doc', description: 'Pro members are eligible. Top builds are judged on creativity, execution, and usefulness.' },
        { id: 'fq-4', title: 'Can I use any tech stack?', type: 'doc', description: 'Yes. We teach with Next.js + Claude, but you can build with anything.' },
        { id: 'fq-5', title: 'What\'s the difference between Free and Pro?', type: 'doc', description: 'Free gets you weekly drops. Pro unlocks all content, templates, prizes, and private groups.' },
        { id: 'fq-6', title: 'How do I level up on the leaderboard?', type: 'doc', description: 'Watch drops (+5), submit builds (+25), win prizes (+25-100), post in community (+5).' },
        { id: 'fq-7', title: 'Can I join late or skip weeks?', type: 'doc', description: 'Yes. All past drops stay accessible. Go at your own pace.' },
        { id: 'fq-8', title: 'How do I cancel Pro?', type: 'doc', description: 'One click in your profile. No questions, no lock-in.' },
      ],
    },
  ]

  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0)
  const completedLessons = modules.reduce((a, m) => a + m.lessons.filter(l => l.completed).length, 0)

  return (
    <AppLayout>
      <PreviewBanner feature="Classroom" />
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Classroom</h1>
            <p className="text-[13px] text-zinc-500 mt-1">Guides, templates, and everything you need to build.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[12px] text-zinc-600">
            <span className="flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" /> {modules.length} modules
            </span>
            <span className="text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {totalLessons} items
            </span>
            {completedLessons > 0 && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-1.5 text-blue-500">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {completedLessons} done
                </span>
              </>
            )}
          </div>
        </div>

        {/* Overall progress */}
        {completedLessons > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden max-w-xs">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500" style={{ width: `${(completedLessons / totalLessons) * 100}%` }} />
            </div>
            <span className="text-[11px] text-zinc-500">{Math.round((completedLessons / totalLessons) * 100)}% complete</span>
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-4">
        {modules.map(module => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </AppLayout>
  )
}
