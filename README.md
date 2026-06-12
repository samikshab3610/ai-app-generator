Good. Now let's write the README while Vercel builds. Create/replace `README.md` with this:

```markdown
# AI App Generator

A metadata-driven application runtime that converts JSON configuration into live, full-stack web applications.

## 🚀 Live Demo
[https://ai-app-generator-beta.vercel.app](https://ai-app-generator-beta.vercel.app)

## 📖 What it does
Paste a JSON config → get a live working app instantly.

The system dynamically generates:
- Frontend UI (forms, tables, hero sections, features grids, navbars)
- Backend APIs (CRUD operations per generated app)
- Database records (PostgreSQL via Neon)
- Workflows (form submit → save to DB → notify owner)

## 🛠 Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL (Neon) + Prisma ORM v7
- **Auth**: NextAuth.js (credentials)
- **Deployment**: Vercel + Neon

## ✨ Features
- ✅ JSON → Live App rendering engine
- ✅ Graceful handling of invalid/missing/unknown config
- ✅ Authentication (signup, login, logout)
- ✅ Dashboard with project management
- ✅ CSV Import — bulk upload data into any generated app
- ✅ Notifications — bell alerts for app creation and form submissions
- ✅ PWA — installable on mobile, offline support
- ✅ Shareable app URLs at `/app/[id]`

## 📋 Supported Components
| Type | Description |
|------|-------------|
| `form` | Dynamic form with text, number, email, select, textarea, checkbox fields |
| `table` | Data table with configurable columns |
| `hero` | Landing page hero section with CTA button |
| `features` | Feature grid with icons |
| `navbar` | Navigation bar with links |

## 🧪 Sample JSON Configs

### CRUD App
```json
{
  "appType": "crud",
  "name": "Task Manager",
  "pages": [{
    "components": [
      {
        "type": "form",
        "title": "Add Task",
        "fields": [
          { "name": "title", "label": "Title", "type": "text", "required": true },
          { "name": "priority", "type": "select", "options": ["Low", "Medium", "High"] }
        ]
      },
      {
        "type": "table",
        "columns": [
          { "key": "title", "label": "Title" },
          { "key": "priority", "label": "Priority" }
        ]
      }
    ]
  }]
}
```

### Landing Page
```json
{
  "appType": "landing",
  "name": "My Portfolio",
  "pages": [{
    "components": [
      { "type": "navbar", "logoText": "Portfolio", "links": [{ "label": "About", "href": "#" }] },
      { "type": "hero", "title": "Hello World", "subtitle": "I build things", "buttonText": "View Work" },
      { "type": "features", "title": "Skills", "items": [{ "title": "React", "icon": "⚛️" }] }
    ]
  }]
}
```

## 🏗 Architecture

```
JSON Config → Validator → Sanitizer → Component Registry → Live App
                                              ↓
                                    Dynamic API Routes
                                              ↓
                                    PostgreSQL (Neon)
```

## ⚙️ Local Setup

```bash
# Clone
git clone https://github.com/samikshab3610/ai-app-generator.git
cd ai-app-generator
git checkout clean-rebuild

# Install
npm install

# Environment variables
cp .env.example .env
# Add DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# Database
npx prisma db push
npx prisma generate

# Run
npm run dev
```

## 🏗 Build Phases
- **Phase 1**: Project scaffold, Prisma schema, Neon DB setup
- **Phase 2**: Rendering engine, component registry, live preview
- **Phase 3**: Auth, dashboard, projects API, records API, CSV API, notifications
- **Phase 4**: PWA support, CSV import UI, notifications wired
- **Phase 5**: Vercel deployment, production fixes, README

## 👩‍💻 Built By
Samiksha Bhore — AI/ML Engineering Student
```
