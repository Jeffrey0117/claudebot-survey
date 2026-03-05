# ClaudeBot Survey

Course interest survey for Threads followers. Users log in with name + email + code, fill out survey, results stored in JSON.

## Stack
- Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- Auth: next-auth v5 (credentials provider, JWT session)
- DB: flat-file JSON (`data/surveys.json`)
- Validation: zod

## Structure
```
src/
  app/
    page.tsx              ← Survey form page
    login/page.tsx        ← Login page (name + email + code)
    admin/page.tsx        ← View all responses
    layout.tsx            ← Root layout + ThemeProvider
    api/
      survey/route.ts     ← POST submit, GET check duplicate
      admin/route.ts      ← GET all responses (admin)
      auth/[...nextauth]/ ← NextAuth route handler
  components/
    SurveyForm.tsx        ← Main survey form component
    ThemeProvider.tsx      ← Dark/light theme context
    ThemeToggle.tsx        ← Theme switcher button
  lib/
    auth.ts               ← NextAuth config (credentials + JWT)
    db.ts                 ← JSON file read/write (data/surveys.json)
```

## Key Details
- Auth code: `process.env.SURVEY_CODE` (default "2026")
- Duplicate prevention: one submission per email
- Deploy: CloudPipe (port 3456, runner: next)

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
