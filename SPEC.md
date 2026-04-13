# Legality - Legal Guidance MVP Specification

## 1. Concept & Vision

Legality is an AI-powered legal guidance platform that democratizes access to legal knowledge. It provides immediate, structured assistance in stressful legal situations by matching users with similar cases, generating actionable recommendations, and connecting them with qualified lawyers. The experience should feel like having a calm, knowledgeable friend who happens to be a legal expert—reassuring without being clinical, urgent without being overwhelming.

**Personality**: Empathetic, clear, trustworthy, action-oriented. Not overwhelming with legalese.

## 2. Design Language

### Aesthetic Direction
Clean, professional yet approachable. Inspired by modern healthcare apps (Calm, Headspace) meets legal gravitas. White space is used generously to reduce cognitive load in stressful moments.

### Color Palette
- **Primary**: `#1E3A5F` (Deep Navy - trust, authority)
- **Secondary**: `#3B82F6` (Bright Blue - action, clarity)
- **Accent**: `#10B981` (Emerald - positive outcomes, success)
- **Warning**: `#F59E0B` (Amber - caution, attention)
- **Danger**: `#EF4444` (Red - emergency, urgency)
- **Background**: `#F8FAFC` (Off-white - clean, calm)
- **Surface**: `#FFFFFF` (White - cards, inputs)
- **Text Primary**: `#1E293B` (Slate-900)
- **Text Secondary**: `#64748B` (Slate-500)
- **Border**: `#E2E8F0` (Slate-200)

### Typography
- **Headings**: Inter (weight 600-700)
- **Body**: Inter (weight 400-500)
- **Monospace**: JetBrains Mono (for legal citations)
- **Scale**: 12/14/16/18/20/24/30/36/48px

### Spatial System
- Base unit: 4px
- Common spacing: 8, 12, 16, 24, 32, 48, 64px
- Card padding: 24px
- Section gaps: 48-64px
- Border radius: 8px (cards), 6px (buttons), 12px (modals)

### Motion Philosophy
- **Transitions**: 150-200ms ease-out for micro-interactions
- **Page transitions**: 300ms fade
- **Loading states**: Subtle pulse animations
- **Success feedback**: Scale + color shift (200ms)
- **Urgency**: Gentle pulse on emergency buttons

### Visual Assets
- **Icons**: Lucide React (consistent, clean)
- **Illustrations**: Abstract geometric patterns for empty states
- **Avatar placeholders**: Gradient backgrounds with initials

## 3. Layout & Structure

### Page Architecture

#### Landing/Auth Pages
- Full-screen gradient hero
- Centered auth card (max-width 420px)
- Minimal navigation (logo + help link)

#### Dashboard (Post-login)
- Fixed sidebar (280px) with navigation
- Main content area with max-width 900px
- Top bar with user info + quick actions

#### Query Flow
- Single-column centered layout (max-width 680px)
- Step-by-step wizard with progress indicator
- Large touch targets for mobile

#### Results Page
- Two-column on desktop (main content + sidebar)
- Collapsible sections
- Sticky action bar at bottom

### Responsive Strategy
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Sidebar collapses to bottom nav on mobile
- Cards stack vertically on mobile

## 4. Features & Interactions

### 4.1 Authentication System

#### Signup Flow
1. Email input → validation (format check)
2. Password input → strength indicator + requirements display
3. ID/SSN verification (masked input, last 4 digits only for MVP)
4. Terms acceptance + disclaimer acknowledgment (required checkbox)
5. Account creation

#### Login Flow
1. Email + password
2. Remember me option
3. Forgot password link (placeholder for MVP)

#### Emergency Mode
- Visible "Continue without account" button on login page
- Single query allowed per IP (tracked in DB)
- After use: redirect to signup with message
- Warning modal: "This is your one free query. Create an account to track your case history."

### 4.2 Legal Query Input

#### Form Fields
1. **Category selector** (required)
   - Car Accident
   - Self-Defense
   - Property Dispute
   - Employment Issue
   - Contract Issue
   - Other

2. **Situation description** (required)
   - Textarea with 50-2000 char limit
   - Character counter
   - Placeholder: "Describe what happened, including when, where, and who was involved..."
   - AI-powered prompt suggestions

3. **Location** (optional, auto-detected)
   - City, State, County fields
   - Auto-fill from browser geolocation (with permission)

4. **Incident date** (optional)
   - Date picker, default to today
   - Cannot be future date

5. **Severity** (required)
   - Emergency (red) - immediate danger, police involved
   - High (orange) - significant injury/property damage
   - Medium (yellow) - minor incident, no injuries
   - Low (green) - precautionary, no current dispute

6. **Additional context** (optional)
   - Checkbox options: Police involved, Insurance involved, Witnesses present, Documentation available

#### Validation
- Category required
- Description min 50 characters
- Show inline validation errors
- Disable submit until valid

### 4.3 Case Matching Engine

#### Mock Case Database
- 50+ pre-populated cases across categories
- Fields: title, jurisdiction, summary, outcome, reasoning, category, severity, date
- Searchable by keywords, category, jurisdiction

#### Matching Algorithm
- TF-IDF style keyword matching
- Category filter
- Severity proximity
- Return top 5-10 matches

#### Results Display
For each matched case:
- Case title (clickable for full details)
- Jurisdiction badge
- Summary (first 200 chars + "Read more")
- Outcome pill (Favorable/Unfavorable/Settled/Ongoing)
- Similarity score (percentage)
- Key takeaways (bullets)

### 4.4 AI Legal Insight Layer

#### Summary Synthesis
```
Based on X similar cases:
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

[X%] of cases were resolved favorably when [specific action]
```

#### Recommended Next Steps
Prioritized list with:
- Action item
- Reasoning (why it's important)
- Difficulty indicator (easy/medium/important)

#### Risk Assessment
- Liability meter (Low/Medium/High)
- Potential consequences list
- Mitigation suggestions

### 4.5 Emergency Actions

#### Quick Action Bar (always visible on results)
- **Call 911** - Large red button, opens tel: link
- **Contact Lawyer** - Opens lawyer matching panel
- **Save Case** - Saves to user dashboard
- **Share** - Copy link or share via native share (if available)

### 4.6 Lawyer Matching

#### Matching Criteria
- Practice specialty (matches query category)
- Location (within 50 miles of user)
- Rating (minimum 4.0 for premium, 3.0 for free)
- Experience (minimum 2 years)

#### Lawyer Card Display
- Avatar/Photo
- Name + Firm
- Rating (stars + number)
- Years of experience
- Specialties (pills)
- "Connect" button → opens contact modal
- "View Profile" → expanded view

#### Contact Modal
- Contact options: Phone, Email, Schedule Consultation
- Mock contact (no real calls/emails in MVP)
- Disclaimer about connection

### 4.7 Subscription System

#### Free Tier
- County-level case access
- Standard response time (5-10 seconds)
- Basic lawyer matching
- 3 saved cases maximum
- 1 query per emergency mode

#### Premium Tier ($19.99/month)
- Cross-region case access
- Fast response (1-3 seconds)
- Premium lawyer prioritization
- Unlimited saved cases
- Priority emergency mode
- Export case summaries (PDF)

#### Subscription UI
- Plan comparison card
- Current plan indicator in sidebar
- Upgrade CTA buttons
- Mock payment (Stripe test card display)

### 4.8 User Dashboard

#### Sections
1. **Recent Queries** - Last 5 queries with status
2. **Saved Cases** - Bookmarked cases
3. **Lawyer Connections** - History of contacted lawyers
4. **Profile** - Account settings, subscription

#### Query Card
- Category icon
- Date submitted
- Status: Processing/Complete
- Quick actions: View, Delete

### 4.9 Disclaimer System

#### Signup Acknowledgment
- Modal with full disclaimer text
- Checkbox: "I understand this is not legal advice"
- Cannot proceed without checking
- Stored in user record with timestamp

#### Results Page Disclaimer
- Banner at top: "This information is for educational purposes only"
- Footer on every page
- Tooltip explanations on legal terms

## 5. Component Inventory

### Buttons
- **Primary**: Navy bg, white text, hover darken 10%
- **Secondary**: White bg, navy border/text, hover light blue bg
- **Danger**: Red bg, white text, pulse animation for emergency
- **Ghost**: Transparent, text only, underline on hover
- **States**: default, hover, active, disabled, loading (spinner)

### Form Inputs
- **Text/Textarea**: Border, focus ring blue, error ring red
- **Select**: Custom dropdown with search
- **Checkbox**: Custom styled, animated check
- **Radio**: Custom circles, fill animation
- **States**: default, focus, error, disabled

### Cards
- **Query Card**: Icon, title, date, status badge, actions
- **Case Card**: Title, jurisdiction, summary, outcome pill, similarity
- **Lawyer Card**: Avatar, name, rating, specialties, CTA
- **Stats Card**: Number, label, trend indicator

### Navigation
- **Sidebar**: Logo, nav items with icons, user section, collapse button
- **Mobile Nav**: Bottom tab bar with 4 main sections
- **Breadcrumbs**: For nested pages

### Modals
- **Confirmation**: Icon, title, message, cancel/confirm buttons
- **Form Modal**: Title, form content, submit/cancel
- **Alert Modal**: Warning/error icon, message, dismiss button
- Backdrop blur, slide-up animation on mobile

### Loading States
- **Skeleton**: Pulse animation on placeholder shapes
- **Spinner**: Circular, primary color
- **Progress**: Linear bar for multi-step processes

### Empty States
- Illustration
- Headline
- Description
- CTA button

### Toast Notifications
- Success (green), Error (red), Info (blue), Warning (yellow)
- Auto-dismiss after 5 seconds
- Manual dismiss X button
- Stack from bottom-right

## 6. Technical Approach

### Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Auth**: NextAuth.js with credentials provider
- **AI**: OpenAI GPT-4 API
- **Icons**: Lucide React
- **State**: React Context + Server Actions

### Project Structure
```
/app
  /api
    /auth/[...nextauth]
    /queries
    /cases
    /lawyers
    /subscription
  /(auth)
    /login
    /signup
  /(dashboard)
    /dashboard
    /query/new
    /query/[id]
    /lawyers
    /settings
  /layout.tsx
  /page.tsx
/components
  /ui (reusable primitives)
  /features (domain-specific)
/lib
  /prisma.ts
  /auth.ts
  /openai.ts
  /utils.ts
/prisma
  /schema.prisma
  /seed.ts
/types
  /index.ts
```

### Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  verified      Boolean   @default(false)
  verificationId String?
  disclaimerAccepted Boolean @default(false)
  disclaimerAcceptedAt DateTime?
  subscription  Subscription?
  queries       Query[]
  savedCases    SavedCase[]
  lawyerConnections LawyerConnection[]
  emergencyUses EmergencyAccess[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Subscription {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  tier          Tier      @default(FREE)
  status        SubStatus @default(ACTIVE)
  expiresAt     DateTime?
  stripeCustomerId String?
  createdAt     DateTime  @default(now())
}

enum Tier {
  FREE
  PREMIUM
}

enum SubStatus {
  ACTIVE
  CANCELLED
  EXPIRED
}

model Query {
  id            String    @id @default(cuid())
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  category      String
  description   String
  location      String?
  incidentDate  DateTime?
  severity      String
  contextFlags  Json?
  aiSummary     String?
  aiRecommendations Json?
  riskAssessment Json?
  matchedCases  Json?
  status        QueryStatus @default(PENDING)
  ipAddress     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum QueryStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model Case {
  id            String    @id @default(cuid())
  title         String
  category      String
  jurisdiction  String
  summary       String
  outcome       String
  reasoning     String
  year          Int
  citations     String?
  createdAt     DateTime  @default(now())
  savedBy       SavedCase[]
}

model SavedCase {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  caseId        String
  case          Case      @relation(fields: [caseId], references: [id])
  notes         String?
  createdAt     DateTime  @default(now())

  @@unique([userId, caseId])
}

model Lawyer {
  id            String    @id @default(cuid())
  name          String
  firm          String
  email         String?
  phone         String?
  specialties   String[]
  rating        Float
  reviewCount   Int
  yearsExperience Int
  location      String
  bio           String?
  avatarUrl     String?
  connections   LawyerConnection[]
  createdAt     DateTime  @default(now())
}

model LawyerConnection {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  lawyerId      String
  lawyer        Lawyer    @relation(fields: [lawyerId], references: [id])
  connectedAt   DateTime  @default(now())
}

model EmergencyAccess {
  id            String    @id @default(cuid())
  ipAddress     String
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  usedAt        DateTime  @default(now())
}
```

### API Endpoints

#### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

#### Queries
- `POST /api/queries` - Create new query
- `GET /api/queries` - List user's queries
- `GET /api/queries/[id]` - Get query details
- `DELETE /api/queries/[id]` - Delete query

#### Cases
- `GET /api/cases` - Search cases
- `GET /api/cases/[id]` - Get case details
- `POST /api/cases/save` - Save case to profile
- `DELETE /api/cases/save/[id]` - Remove saved case

#### Lawyers
- `GET /api/lawyers` - List/search lawyers
- `GET /api/lawyers/[id]` - Get lawyer profile
- `POST /api/lawyers/connect` - Record connection

#### Subscription
- `GET /api/subscription` - Get current subscription
- `POST /api/subscription` - Create/upgrade subscription

### AI Integration

#### Case Analysis Prompt
```
You are a legal research assistant. Analyze the user's situation and 
similar cases to provide helpful guidance.

User's Situation:
- Category: {category}
- Description: {description}
- Location: {location}
- Severity: {severity}

Similar Cases Found:
{similarCases}

Based on this information, provide:
1. Case Summary Synthesis (2-3 paragraphs)
2. Recommended Next Steps (5-7 action items)
3. Risk Assessment (liability level + consequences)

Remember: You are NOT a lawyer. Do not provide legal advice. 
Always encourage consulting a licensed attorney.
```

### Security Considerations
- Password hashing with bcrypt
- JWT tokens with short expiry (1 hour)
- CSRF protection via NextAuth
- Input sanitization on all user inputs
- Rate limiting on API endpoints
- IP tracking for emergency mode
