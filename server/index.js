require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')

const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Anthropic = require('@anthropic-ai/sdk')

const { OAuth2Client } = require('google-auth-library')
const appleSignin = require('apple-signin-auth')

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// ── Database ────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// ── Google OAuth Client ─────────────────────────────────────────
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.API_URL || `http://localhost:${PORT}`}/api/auth/google/callback`
)

// ── Helpers ─────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

function verifyToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    return jwt.verify(authHeader.slice(7), process.env.JWT_SECRET)
  } catch {
    return null
  }
}

async function findOrCreateOAuthUser(email, fullName) {
  const normalized = email.toLowerCase().trim()
  const existing = await pool.query('SELECT * FROM profiles WHERE email = $1', [normalized])

  if (existing.rows.length > 0) {
    return existing.rows[0]
  }

  const result = await pool.query(
    `INSERT INTO profiles (email, full_name, membership_tier, is_admin, total_points, created_at, updated_at)
     VALUES ($1, $2, 'free', false, 0, NOW(), NOW()) RETURNING *`,
    [normalized, fullName || normalized.split('@')[0]]
  )
  return result.rows[0]
}

// ── Middleware ───────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://alt-ai-labs.vercel.app',
  'https://altaihub.com',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(null, false)
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health ──────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// ── Waitlist ────────────────────────────────────────────────────
app.post('/api/waitlist', async (req, res) => {
  try {
    const { email } = req.body
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    const normalized = email.toLowerCase().trim()
    const existing = await pool.query('SELECT id FROM waitlist WHERE email = $1', [normalized])
    if (existing.rows.length > 0) {
      return res.json({ message: "You're already on the list!" })
    }

    await pool.query('INSERT INTO waitlist (email, joined_at) VALUES ($1, NOW())', [normalized])
    const countResult = await pool.query('SELECT COUNT(*) FROM waitlist')
    res.json({ message: "You're in!", count: parseInt(countResult.rows[0].count) })
  } catch (err) {
    console.error('Waitlist error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/api/waitlist', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM waitlist')
    res.json({ count: parseInt(result.rows[0].count) })
  } catch {
    res.json({ count: 0 })
  }
})

// ═══════════════════════════════════════════════════════════════
// AUTH — Email/Password
// ═══════════════════════════════════════════════════════════════

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const normalized = email.toLowerCase().trim()
    const existing = await pool.query('SELECT id FROM profiles WHERE email = $1', [normalized])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Account already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const result = await pool.query(
      `INSERT INTO profiles (email, password_hash, full_name, membership_tier, is_admin, total_points, created_at, updated_at)
       VALUES ($1, $2, $3, 'free', false, 0, NOW(), NOW()) RETURNING id, email, full_name, membership_tier, total_points`,
      [normalized, hashedPassword, full_name || normalized.split('@')[0]]
    )

    const user = result.rows[0]
    const token = signToken(user)
    res.json({ token, user })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const normalized = email.toLowerCase().trim()
    const result = await pool.query('SELECT * FROM profiles WHERE email = $1', [normalized])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]
    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account uses Google sign-in' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken(user)
    const { password_hash, ...safeUser } = user
    res.json({ token, user: safeUser })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/api/auth/me', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const result = await pool.query(
      'SELECT id, email, full_name, avatar_url, bio, membership_tier, is_admin, total_points, created_at, updated_at FROM profiles WHERE id = $1',
      [decoded.sub]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })
    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('Auth me error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// AUTH — Google Sign In
// ═══════════════════════════════════════════════════════════════

// Step 1: Frontend redirects here → we redirect to Google
app.get('/api/auth/google', (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
  })
  res.redirect(url)
})

// Step 2: Google redirects back here with code
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query
    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`)
    }

    const { tokens } = await googleClient.getToken(code)
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const email = payload.email
    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=google_no_email`)
    }

    const fullName = payload.name || null
    const user = await findOrCreateOAuthUser(email, fullName)
    const token = signToken(user)

    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`)
  } catch (err) {
    console.error('Google OAuth error:', err)
    res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`)
  }
})

// ═══════════════════════════════════════════════════════════════
// AUTH — Apple Sign In
// ═══════════════════════════════════════════════════════════════

// Step 1: Frontend/app redirects here → we redirect to Apple
app.get('/api/auth/apple', (req, res) => {
  const url = `https://appleid.apple.com/auth/authorize?` +
    `client_id=${process.env.APPLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(`${process.env.API_URL}/api/auth/apple/callback`)}` +
    `&response_type=code id_token` +
    `&scope=name email` +
    `&response_mode=form_post`
  res.redirect(url)
})

// Step 2: Apple POSTs back here with id_token + code
app.post('/api/auth/apple/callback', async (req, res) => {
  try {
    const { id_token, user: appleUser } = req.body

    if (!id_token) {
      return res.redirect(`${FRONTEND_URL}/login?error=apple_auth_failed`)
    }

    const payload = await appleSignin.verifyIdToken(id_token, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    })

    const email = payload.email
    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=apple_no_email`)
    }

    // Apple only sends the user's name on the FIRST sign-in
    let fullName = null
    if (appleUser) {
      try {
        const parsed = typeof appleUser === 'string' ? JSON.parse(appleUser) : appleUser
        if (parsed.name) {
          fullName = [parsed.name.firstName, parsed.name.lastName].filter(Boolean).join(' ')
        }
      } catch {}
    }

    const user = await findOrCreateOAuthUser(email, fullName)
    const token = signToken(user)

    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`)
  } catch (err) {
    console.error('Apple OAuth error:', err)
    res.redirect(`${FRONTEND_URL}/login?error=apple_auth_failed`)
  }
})

// ═══════════════════════════════════════════════════════════════
// CHALLENGES
// ═══════════════════════════════════════════════════════════════

app.get('/api/challenges', async (req, res) => {
  try {
    const { community_id, status } = req.query
    let query = 'SELECT * FROM drops'
    const params = []
    const conditions = []

    if (community_id) {
      conditions.push(`community_id = $${params.length + 1}`)
      params.push(community_id)
    }
    if (status) {
      conditions.push(`status = $${params.length + 1}`)
      params.push(status)
    }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ')
    query += ' ORDER BY created_at DESC'

    const result = await pool.query(query, params)
    res.json({ challenges: result.rows })
  } catch (err) {
    console.error('Challenges error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/api/challenges/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drops WHERE slug = $1', [req.params.slug])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Challenge not found' })
    res.json({ challenge: result.rows[0] })
  } catch (err) {
    console.error('Challenge detail error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// AI REVIEW (async, non-blocking)
// ═══════════════════════════════════════════════════════════════

async function generateAIReview(submissionId, dropId, projectUrl, demoUrl, notes) {
  if (!process.env.ANTHROPIC_API_KEY) return

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    // Get drop details for context
    const dropResult = await pool.query(
      'SELECT title, challenge_brief, challenge_deliverables, challenge_rules FROM drops WHERE id = $1',
      [dropId]
    )
    if (dropResult.rows.length === 0) return
    const drop = dropResult.rows[0]

    const deliverables = Array.isArray(drop.challenge_deliverables) ? drop.challenge_deliverables.join('\n- ') : ''
    const rules = Array.isArray(drop.challenge_rules) ? drop.challenge_rules.join('\n- ') : ''

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `You are a friendly AI mentor reviewing a builder's submission on Alt AI Labs.

CHALLENGE: "${drop.title}"
BRIEF: ${drop.challenge_brief || 'N/A'}
DELIVERABLES:
- ${deliverables || 'N/A'}
RULES:
- ${rules || 'N/A'}

SUBMISSION:
- Project URL: ${projectUrl}
- Demo URL: ${demoUrl || 'Not provided'}
- Builder's notes: ${notes || 'None'}

Give a short, encouraging review in this exact JSON format:
{
  "score": <number 1-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<suggestion 1>", "<suggestion 2>"],
  "summary": "<1-2 sentence overall feedback>"
}

Be encouraging but honest. Focus on what they built, not what they didn't. Keep each item under 15 words. Return ONLY the JSON, no markdown.`
      }]
    })

    const responseText = message.content[0]?.text
    if (!responseText) return

    // Parse and store
    const review = JSON.parse(responseText)
    await pool.query(
      'UPDATE submissions SET feedback = $1, score = $2, updated_at = NOW() WHERE id = $3',
      [JSON.stringify(review), review.score, submissionId]
    )

    // Notify the builder
    const sub = await pool.query('SELECT user_id FROM submissions WHERE id = $1', [submissionId])
    if (sub.rows[0]) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, body, data)
         VALUES ($1, 'ai_review', 'AI Review Ready', $2, $3)`,
        [sub.rows[0].user_id, review.summary, JSON.stringify({ submission_id: submissionId })]
      )
    }
  } catch (err) {
    console.error('AI review error:', err.message)
  }
}

// ═══════════════════════════════════════════════════════════════
// SUBMISSIONS
// ═══════════════════════════════════════════════════════════════

app.post('/api/submissions', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { drop_id, project_url, demo_url, notes } = req.body
    if (!drop_id || !project_url) {
      return res.status(400).json({ error: 'drop_id and project_url required' })
    }

    const result = await pool.query(
      `INSERT INTO submissions (user_id, drop_id, project_url, demo_url, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'submitted', NOW(), NOW())
       ON CONFLICT (user_id, drop_id)
       DO UPDATE SET project_url = $3, demo_url = $4, notes = $5, updated_at = NOW()
       RETURNING *`,
      [decoded.sub, drop_id, project_url, demo_url || null, notes || null]
    )

    // Record daily activity for streak
    await recordActivity(decoded.sub, 'submit', 25)

    // Trigger async AI review (non-blocking)
    generateAIReview(result.rows[0].id, drop_id, project_url, demo_url, notes)
      .catch(err => console.error('AI review failed:', err.message))

    res.json({ submission: result.rows[0] })
  } catch (err) {
    console.error('Submission error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/api/submissions', async (req, res) => {
  try {
    const { drop_id } = req.query
    if (!drop_id) return res.status(400).json({ error: 'drop_id required' })

    const result = await pool.query(
      `SELECT s.*, p.full_name, p.avatar_url FROM submissions s
       LEFT JOIN profiles p ON s.user_id = p.id
       WHERE s.drop_id = $1 ORDER BY s.created_at DESC`,
      [drop_id]
    )
    res.json({ submissions: result.rows })
  } catch (err) {
    console.error('Submissions list error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════

app.get('/api/leaderboard', async (req, res) => {
  try {
    const maxLimit = Math.min(parseInt(req.query.limit) || 50, 100)
    const result = await pool.query(
      'SELECT id, full_name, avatar_url, membership_tier, total_points FROM profiles ORDER BY total_points DESC LIMIT $1',
      [maxLimit]
    )
    res.json({ leaderboard: result.rows.map((row, i) => ({ ...row, rank: i + 1 })) })
  } catch (err) {
    console.error('Leaderboard error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════

// GET /api/profiles/:username — public profile
app.get('/api/profiles/:username', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, full_name, avatar_url, bio, membership_tier, total_points, github_url, twitter_url, linkedin_url, website_url, created_at
       FROM profiles WHERE username = $1`,
      [req.params.username]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found' })

    const profile = result.rows[0]

    // Get submissions
    const subs = await pool.query(
      `SELECT s.*, d.title AS drop_title, d.slug AS drop_slug
       FROM submissions s JOIN drops d ON s.drop_id = d.id
       WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
      [profile.id]
    )

    // Get streak
    const streak = await pool.query(
      'SELECT current_streak, longest_streak FROM streaks WHERE user_id = $1',
      [profile.id]
    )

    // Get heatmap
    const heatmap = await pool.query(
      `SELECT activity_date, COUNT(*)::int AS count
       FROM daily_activity WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '365 days'
       GROUP BY activity_date ORDER BY activity_date`,
      [profile.id]
    )

    res.json({
      profile,
      submissions: subs.rows,
      streak: streak.rows[0] || { current_streak: 0, longest_streak: 0 },
      heatmap: heatmap.rows,
    })
  } catch (err) {
    console.error('Public profile error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.patch('/api/profile', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { full_name, bio, username, github_url, twitter_url, linkedin_url, website_url } = req.body
    const updates = []
    const params = []

    if (full_name !== undefined) { params.push(full_name); updates.push(`full_name = $${params.length}`) }
    if (bio !== undefined) { params.push(bio); updates.push(`bio = $${params.length}`) }
    if (username !== undefined) { params.push(username.toLowerCase().replace(/[^a-z0-9_-]/g, '')); updates.push(`username = $${params.length}`) }
    if (github_url !== undefined) { params.push(github_url || null); updates.push(`github_url = $${params.length}`) }
    if (twitter_url !== undefined) { params.push(twitter_url || null); updates.push(`twitter_url = $${params.length}`) }
    if (linkedin_url !== undefined) { params.push(linkedin_url || null); updates.push(`linkedin_url = $${params.length}`) }
    if (website_url !== undefined) { params.push(website_url || null); updates.push(`website_url = $${params.length}`) }
    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' })

    params.push(decoded.sub)
    updates.push('updated_at = NOW()')

    const result = await pool.query(
      `UPDATE profiles SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING id, email, full_name, avatar_url, bio, membership_tier, total_points`,
      params
    )
    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// COMMUNITIES
// ═══════════════════════════════════════════════════════════════

app.get('/api/communities', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM communities ORDER BY created_at')
    res.json({ communities: result.rows })
  } catch (err) {
    console.error('Communities error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/api/communities/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM communities WHERE slug = $1', [req.params.slug])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Community not found' })
    res.json({ community: result.rows[0] })
  } catch (err) {
    console.error('Community detail error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// POSTS
// ═══════════════════════════════════════════════════════════════

app.get('/api/posts', async (req, res) => {
  try {
    const { community_id } = req.query
    if (!community_id) return res.status(400).json({ error: 'community_id required' })

    const result = await pool.query(
      `SELECT p.*, row_to_json(pr.*) AS profile
       FROM posts p
       LEFT JOIN profiles pr ON p.user_id = pr.id
       WHERE p.community_id = $1
       ORDER BY p.is_pinned DESC, p.created_at DESC
       LIMIT 50`,
      [community_id]
    )

    // Strip password_hash from joined profile
    const posts = result.rows.map(p => {
      if (p.profile) delete p.profile.password_hash
      return p
    })

    res.json({ posts })
  } catch (err) {
    console.error('Posts error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/posts', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { community_id, title, body, category, drop_id } = req.body
    if (!community_id || !title || !body) {
      return res.status(400).json({ error: 'community_id, title, and body required' })
    }

    const result = await pool.query(
      `INSERT INTO posts (community_id, user_id, title, body, category, drop_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [community_id, decoded.sub, title, body, category || 'builds', drop_id || null]
    )

    // Record daily activity for streak
    await recordActivity(decoded.sub, 'post', 5)

    res.json({ post: result.rows[0] })
  } catch (err) {
    console.error('Create post error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// COMMENTS
// ═══════════════════════════════════════════════════════════════

app.get('/api/comments', async (req, res) => {
  try {
    const { post_id } = req.query
    if (!post_id) return res.status(400).json({ error: 'post_id required' })

    const result = await pool.query(
      `SELECT c.*, row_to_json(p.*) AS profile
       FROM comments c
       LEFT JOIN profiles p ON c.user_id = p.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [post_id]
    )

    const comments = result.rows.map(c => {
      if (c.profile) delete c.profile.password_hash
      return c
    })

    res.json({ comments })
  } catch (err) {
    console.error('Comments error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/comments', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { post_id, body } = req.body
    if (!post_id || !body) {
      return res.status(400).json({ error: 'post_id and body required' })
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, body, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [post_id, decoded.sub, body]
    )

    // Increment comment count on post
    await pool.query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
      [post_id]
    )

    // Notify post author (if different from commenter)
    const post = await pool.query('SELECT user_id, title FROM posts WHERE id = $1', [post_id])
    if (post.rows[0] && post.rows[0].user_id !== decoded.sub) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, body, data)
         VALUES ($1, 'comment', 'New comment on your post', $2, $3)`,
        [
          post.rows[0].user_id,
          `Someone commented on "${post.rows[0].title}"`,
          JSON.stringify({ post_id }),
        ]
      )
    }

    // Award 2 points + record activity for streak
    await pool.query(
      `INSERT INTO leaderboard_points (user_id, points, reason)
       VALUES ($1, 2, $2)`,
      [decoded.sub, `comment:${result.rows[0].id}`]
    )
    await recordActivity(decoded.sub, 'comment', 2)

    res.json({ comment: result.rows[0] })
  } catch (err) {
    console.error('Create comment error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// GROUPS
// ═══════════════════════════════════════════════════════════════

app.get('/api/groups', async (req, res) => {
  try {
    const { community_id } = req.query
    if (!community_id) return res.status(400).json({ error: 'community_id required' })

    const result = await pool.query(
      `SELECT g.*, COUNT(gm.id)::int AS member_count
       FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id
       WHERE g.community_id = $1
       GROUP BY g.id
       ORDER BY g.created_at`,
      [community_id]
    )
    res.json({ groups: result.rows })
  } catch (err) {
    console.error('Groups error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/groups/:id/join', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const groupId = req.params.id

    // Check group exists and has room
    const group = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId])
    if (group.rows.length === 0) return res.status(404).json({ error: 'Group not found' })

    if (group.rows[0].max_members) {
      const count = await pool.query('SELECT COUNT(*)::int AS count FROM group_members WHERE group_id = $1', [groupId])
      if (count.rows[0].count >= group.rows[0].max_members) {
        return res.status(400).json({ error: 'Group is full' })
      }
    }

    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role, joined_at)
       VALUES ($1, $2, 'member', NOW())
       ON CONFLICT (group_id, user_id) DO NOTHING`,
      [groupId, decoded.sub]
    )

    res.json({ success: true })
  } catch (err) {
    console.error('Join group error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.delete('/api/groups/:id/leave', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await pool.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [req.params.id, decoded.sub]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Leave group error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════

app.get('/api/progress', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { community_id } = req.query
    if (!community_id) return res.status(400).json({ error: 'community_id required' })

    // Get all drop IDs for this community, then find progress
    const result = await pool.query(
      `SELECT dp.* FROM drop_progress dp
       JOIN drops wd ON dp.drop_id = wd.id
       WHERE dp.user_id = $1 AND wd.community_id = $2`,
      [decoded.sub, community_id]
    )
    res.json({ progress: result.rows })
  } catch (err) {
    console.error('Progress error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/progress', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { drop_id } = req.body
    if (!drop_id) return res.status(400).json({ error: 'drop_id required' })

    const result = await pool.query(
      `INSERT INTO drop_progress (user_id, drop_id, watched, watched_at)
       VALUES ($1, $2, true, NOW())
       ON CONFLICT (user_id, drop_id)
       DO UPDATE SET watched = true, watched_at = COALESCE(drop_progress.watched_at, NOW())
       RETURNING *`,
      [decoded.sub, drop_id]
    )

    // Award 5 points for watching (only once)
    await pool.query(
      `INSERT INTO leaderboard_points (user_id, points, reason)
       SELECT $1, 5, $2
       WHERE NOT EXISTS (SELECT 1 FROM leaderboard_points WHERE user_id = $1 AND reason = $2)`,
      [decoded.sub, `watched:${drop_id}`]
    )

    // Record daily activity for streak
    await recordActivity(decoded.sub, 'watch', 5)

    res.json({ progress: result.rows[0] })
  } catch (err) {
    console.error('Progress update error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

app.get('/api/notifications', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)

    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [decoded.sub, limit]
    )

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND read = false',
      [decoded.sub]
    )

    res.json({ notifications: result.rows, unreadCount: countResult.rows[0].count })
  } catch (err) {
    console.error('Notifications error:', err)
    res.json({ notifications: [], unreadCount: 0 })
  }
})

app.patch('/api/notifications', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { ids } = req.body

    if (ids === 'all') {
      await pool.query(
        'UPDATE notifications SET read = true WHERE user_id = $1 AND read = false',
        [decoded.sub]
      )
    } else if (Array.isArray(ids) && ids.length > 0) {
      await pool.query(
        'UPDATE notifications SET read = true WHERE id = ANY($1) AND user_id = $2',
        [ids, decoded.sub]
      )
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Mark read error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/submissions/:id/ai-review — get AI feedback
app.get('/api/submissions/:id/ai-review', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT feedback, score FROM submissions WHERE id = $1',
      [req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
    const { feedback, score } = result.rows[0]
    if (!feedback) return res.json({ review: null })
    res.json({ review: typeof feedback === 'string' ? JSON.parse(feedback) : feedback, score })
  } catch (err) {
    console.error('AI review fetch error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// SUBMISSION VOTES + REVIEWS
// ═══════════════════════════════════════════════════════════════

// GET /api/submissions/by-drop/:dropId — all submissions for a drop (public)
app.get('/api/submissions/by-drop/:dropId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.full_name, p.avatar_url, p.username,
       (SELECT COUNT(*)::int FROM submission_votes sv WHERE sv.submission_id = s.id) AS vote_count
       FROM submissions s
       LEFT JOIN profiles p ON s.user_id = p.id
       WHERE s.drop_id = $1
       ORDER BY (SELECT COUNT(*) FROM submission_votes sv WHERE sv.submission_id = s.id) DESC, s.created_at DESC`,
      [req.params.dropId]
    )
    res.json({ submissions: result.rows })
  } catch (err) {
    console.error('Submissions by drop error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// POST /api/submissions/:id/vote — upvote a submission
app.post('/api/submissions/:id/vote', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    // Can't vote on own submission
    const sub = await pool.query('SELECT user_id FROM submissions WHERE id = $1', [req.params.id])
    if (sub.rows[0]?.user_id === decoded.sub) {
      return res.status(400).json({ error: "Can't vote on your own submission" })
    }

    await pool.query(
      `INSERT INTO submission_votes (submission_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (submission_id, user_id) DO NOTHING`,
      [req.params.id, decoded.sub]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Vote error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// DELETE /api/submissions/:id/vote — remove vote
app.delete('/api/submissions/:id/vote', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await pool.query(
      'DELETE FROM submission_votes WHERE submission_id = $1 AND user_id = $2',
      [req.params.id, decoded.sub]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Unvote error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// POST /api/submissions/:id/review — leave a structured review
app.post('/api/submissions/:id/review', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { creativity_score, execution_score, usefulness_score, comment } = req.body

    await pool.query(
      `INSERT INTO submission_reviews (submission_id, reviewer_id, creativity_score, execution_score, usefulness_score, comment)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (submission_id, reviewer_id)
       DO UPDATE SET creativity_score = $3, execution_score = $4, usefulness_score = $5, comment = $6`,
      [req.params.id, decoded.sub, creativity_score, execution_score, usefulness_score, comment || null]
    )

    // Award 10 points for reviewing
    await pool.query(
      `INSERT INTO leaderboard_points (user_id, points, reason)
       SELECT $1, 10, $2
       WHERE NOT EXISTS (SELECT 1 FROM leaderboard_points WHERE user_id = $1 AND reason = $2)`,
      [decoded.sub, `review:${req.params.id}`]
    )

    // Notify submission author
    const sub = await pool.query('SELECT user_id FROM submissions WHERE id = $1', [req.params.id])
    if (sub.rows[0] && sub.rows[0].user_id !== decoded.sub) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, body)
         VALUES ($1, 'review', 'Your build got reviewed!', 'Someone left feedback on your submission.')`,
        [sub.rows[0].user_id]
      )
    }

    await recordActivity(decoded.sub, 'review', 10)
    res.json({ success: true })
  } catch (err) {
    console.error('Review error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// ═══════════════════════════════════════════════════════════════
// STREAKS + DAILY ACTIVITY
// ═══════════════════════════════════════════════════════════════

const STREAK_MILESTONES = [
  { days: 7, bonus: 50 },
  { days: 30, bonus: 200 },
  { days: 100, bonus: 1000 },
]

async function recordActivity(userId, activityType, points = 0) {
  try {
    // 1. Log the activity (ignore duplicate for same type on same day)
    await pool.query(
      `INSERT INTO daily_activity (user_id, activity_date, activity_type, points_earned)
       VALUES ($1, CURRENT_DATE, $2, $3)
       ON CONFLICT (user_id, activity_date, activity_type) DO NOTHING`,
      [userId, activityType, points]
    )

    // 2. Update streak
    const streakResult = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1', [userId]
    )

    const today = new Date().toISOString().split('T')[0]

    if (streakResult.rows.length === 0) {
      // First ever activity
      await pool.query(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, last_activity_date, updated_at)
         VALUES ($1, 1, 1, CURRENT_DATE, NOW())`,
        [userId]
      )
    } else {
      const streak = streakResult.rows[0]
      const lastDate = streak.last_activity_date?.toISOString().split('T')[0]

      if (lastDate === today) {
        // Already active today, no-op
        return streak.current_streak
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      let newStreak

      if (lastDate === yesterday) {
        // Consecutive day — extend streak
        newStreak = streak.current_streak + 1
      } else {
        // Streak broken — reset to 1
        newStreak = 1
      }

      const newLongest = Math.max(newStreak, streak.longest_streak)

      await pool.query(
        `UPDATE streaks SET current_streak = $1, longest_streak = $2,
         last_activity_date = CURRENT_DATE, updated_at = NOW()
         WHERE user_id = $3`,
        [newStreak, newLongest, userId]
      )

      // Check milestone bonuses
      for (const m of STREAK_MILESTONES) {
        if (newStreak === m.days) {
          await pool.query(
            `INSERT INTO leaderboard_points (user_id, points, reason)
             SELECT $1, $2, $3
             WHERE NOT EXISTS (SELECT 1 FROM leaderboard_points WHERE user_id = $1 AND reason = $3)`,
            [userId, m.bonus, `streak:${m.days}day`]
          )
          await pool.query(
            'UPDATE profiles SET total_points = total_points + $1 WHERE id = $2',
            [m.bonus, userId]
          )
        }
      }

      return newStreak
    }
  } catch (err) {
    console.error('Record activity error:', err.message)
  }
}

// GET /api/streaks — current streak + 12-week heatmap
app.get('/api/streaks', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    // Get streak data
    const streakResult = await pool.query(
      'SELECT current_streak, longest_streak, last_activity_date, streak_freeze_count FROM streaks WHERE user_id = $1',
      [decoded.sub]
    )

    const streak = streakResult.rows[0] || {
      current_streak: 0, longest_streak: 0,
      last_activity_date: null, streak_freeze_count: 0,
    }

    // Check if streak is still alive (last activity was today or yesterday)
    if (streak.last_activity_date) {
      const lastDate = new Date(streak.last_activity_date)
      const daysSince = Math.floor((Date.now() - lastDate.getTime()) / 86400000)
      if (daysSince > 1) {
        streak.current_streak = 0 // Streak is dead but we don't update DB until next action
      }
    }

    // Get 12-week heatmap (84 days)
    const heatmapResult = await pool.query(
      `SELECT activity_date, COUNT(*)::int AS count, SUM(points_earned)::int AS points
       FROM daily_activity
       WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '84 days'
       GROUP BY activity_date
       ORDER BY activity_date`,
      [decoded.sub]
    )

    res.json({
      streak: {
        current: streak.current_streak,
        longest: streak.longest_streak,
        lastActivity: streak.last_activity_date,
        freezesLeft: streak.streak_freeze_count,
      },
      heatmap: heatmapResult.rows,
    })
  } catch (err) {
    console.error('Streaks error:', err)
    res.json({ streak: { current: 0, longest: 0, lastActivity: null, freezesLeft: 0 }, heatmap: [] })
  }
})

// ── Auto-migrate & seed on startup ─────────────────────────────
async function migrate() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db-init.sql'), 'utf8')
    await pool.query(schema)
    console.log('✓ Schema migration complete')

    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
    await pool.query(seed)
    console.log('✓ Seed data loaded')
  } catch (err) {
    console.error('Migration error:', err.message)
  }
}

// ── Start ───────────────────────────────────────────────────────
migrate().then(() => {
  app.listen(PORT, () => {
    console.log(`Alt AI Labs API running on port ${PORT}`)
  })
})
