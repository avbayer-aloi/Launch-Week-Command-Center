## Launch Week Command Center

A launch management tool I built to demonstrate how I'd coordinate Supabase's Launch Weeks. Uses Next.js, Supabase, and shows AI-assisted content workflows.

Built as a portfolio piece for the Supabase Product Marketing role.

### What it does

- Track launches with status, owners, dates, and asset checklists
- Filter and search through active launches
- Dashboard with stats and timeline view
- AI content generation interface (shows mock responses in demo)
- Sample launch content: blog posts, social variants, newsletters

### Tech

- Next.js 14, TypeScript, Tailwind
- Supabase (database + auth)
- Claude AI integration (demo mode without API key)
- Deployed on Netlify

### Why I built this

Supabase's Launch Weeks are their main GTM motion. This shows how I'd think about coordinating that process—tracking launches, managing stakeholders, generating content, and keeping everything organized when timelines shift and priorities compete.
The AI features show how I'd automate routine content generation (announcements, social posts, FAQs) so I could focus on strategy and high-impact work.

### What's real vs demo

- Launch management: fully functional CRUD
- Dashboard: real stats calculated from data
- Filters and search: work
- AI generation: returns mock responses (no API key required)
- Content samples: show actual writing ability
- Launch Week: Sandbox Demo

### Notes

- I had the design match Supabase brand (dark theme, green accents, developer-focused aesthetic).
- I build the code using Claude Code, which aligns with the role's emphasis on using AI tools for marketing automation. I can walk through any architectural decisions or modify features as needed.



  Built by Ashleigh Bayer
avbayer96@gmail.com | Live Demo Link: https://launch-week-command-center.netlify.app/



### Running locally
```bash
git clone [repo-url]
npm install

Create .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
ANTHROPIC_API_KEY=optional

Run the schema in supabase-schema.sql in your Supabase SQL editor.
npm run dev
