# Launch Week Command Center 🚀

A production-quality demo showcasing a modern launch management platform built with Next.js, Supabase, and Claude AI. This is a portfolio piece demonstrating full-stack development skills for a Supabase Product Marketing role application.

## ✨ Features

### 📊 Dashboard
- Real-time statistics and metrics
- Upcoming launches timeline
- Quick action buttons
- Recent activity feed

### 🎯 Launch Management
- Full CRUD operations for launches
- Advanced filtering and search
- Progress tracking with asset checklists
- Status management workflow
- Tag-based organization

### 🤖 AI Content Generation
- **Launch Announcements**: Generate compelling product announcements
- **Social Media Content**: Create platform-specific social posts
- **Developer Messaging**: Technical content for developer audiences
- **FAQ Generation**: Comprehensive Q&A content
- **Competitive Analysis**: Positioning insights and messaging

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, real-time subscriptions)
- **AI Integration**: Anthropic Claude API for content generation
- **Deployment**: Vercel-ready configuration
- **UI Components**: Custom component library with Supabase design system
- **Icons**: Lucide React

## 🎨 Design System

Following Supabase's brand guidelines:
- **Colors**: Dark theme (`#0E1117` background, `#3ECF8E` accent green)
- **Typography**: Clean sans-serif with monospace code styling
- **Components**: Rounded corners, subtle shadows, generous whitespace
- **Interactions**: Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project
- Anthropic API key

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd launch-week-command-center
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

3. **Set up Supabase database**
   
   Run the SQL schema in your Supabase SQL editor:
   ```bash
   # Copy content from supabase-schema.sql
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── assistant/         # AI content generation
│   ├── launches/         # Launch management
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── Header.tsx       # Navigation header
└── lib/                 # Utilities and configurations
    ├── supabase.ts      # Supabase client & types
    ├── claude.ts        # Claude AI integration
    └── utils.ts         # Helper functions
```

## 🗄️ Database Schema

### Tables
- **launches**: Store launch information, status, and metadata
- **activity_log**: Track user actions and system events

### Sample Data
The schema includes sample launches and activities to demonstrate the platform.

## 🤖 AI Features

The platform integrates with Claude AI to generate various types of content:

1. **Product Announcements**: Professional launch announcements
2. **Social Media**: Platform-specific content for Twitter, LinkedIn, Dev.to
3. **Developer Content**: Technical messaging and documentation
4. **FAQ Generation**: Customer support content
5. **Competitive Analysis**: Market positioning insights

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `ANTHROPIC_API_KEY` - Claude AI API key


## 🎯 Portfolio Highlights

This project demonstrates:

- **Full-stack development** with modern technologies
- **Database design** and real-time data management
- **AI integration** for content generation
- **Responsive design** following design system principles
- **Production-ready code** with error handling and optimization
- **API development** with Next.js App Router
- **TypeScript implementation** for type safety
- **Component architecture** with reusable UI elements

## 🔒 Security

- Environment variables for sensitive data
- API route protection
- Input validation and sanitization
- Error boundary implementation
- Secure database queries with RLS policies

## 📝 License

This project is created as a portfolio demonstration and is not licensed for commercial use.

---

**Built for the Supabase Product Marketing team**

Showcasing modern web development practices, AI integration, and production-ready architecture for launch management workflows.
# Launch Week Command Center Demo
