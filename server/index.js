require('dotenv').config()
const express = require('express')
const cors = require('cors')

const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library')

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

app.patch('/api/profile', async (req, res) => {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { full_name, bio } = req.body
    const updates = []
    const params = []

    if (full_name !== undefined) { params.push(full_name); updates.push(`full_name = $${params.length}`) }
    if (bio !== undefined) { params.push(bio); updates.push(`bio = $${params.length}`) }
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
    res.json({ post: result.rows[0] })
  } catch (err) {
    console.error('Create post error:', err)
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

// ── Start ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Alt AI Labs API running on port ${PORT}`)
})
