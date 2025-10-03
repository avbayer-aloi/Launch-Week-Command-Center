'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Copy, FileText, Share2, Mail, Twitter, Linkedin } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function SamplesPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, itemName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemName)
      toast.success(`${itemName} copied to clipboard!`, {
        duration: 2000,
        style: {
          background: '#1A1F2E',
          color: '#FFFFFF',
          border: '1px solid #3ECF8E',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#3ECF8E',
          secondary: '#1A1F2E',
        },
      })
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const blogPostContent = `# Vector Search in Postgres: Now in Public Beta

Today we're opening the beta for Vector Search in Supabase. This lets you run semantic search queries directly inside Postgres, powered by the pgvector extension—no extra services required.

**Why it matters:**
- No extra infrastructure: store and query embeddings right next to your relational data
- Postgres-native: all your queries, joins, and filters just work
- Production-ready: scale from a side project to millions of vectors without changing tools

**Try it now:**
We've seeded every new project with pgvector enabled. Start with a single SQL command:

\`\`\`sql
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536)
);
\`\`\`

Then insert embeddings from your favorite model and query with cosine similarity.

→ Read the full guide`

  const twitterContent = `🚀 Vector Search is now in public beta!

Build semantic search directly inside Postgres with pgvector.

No extra services. No added infra. Just SQL.

→ docs link`

  const linkedinContent = `We're excited to announce that Vector Search is now in public beta at Supabase. With pgvector running natively in Postgres, you can store and query embeddings right alongside your relational data—no extra services needed. This makes it easier than ever to add semantic search, recommendations, and AI-powered features to your apps.`

  const hackerNewsContent = `Supabase just opened Vector Search to public beta.

• pgvector included by default
• Works with any embeddings model
• SQL queries, joins, filters, indexes—all in Postgres`

  const newsletterContent = `🚀 Supabase Launch Week: Vector Search Beta, Edge Functions v2, and More

This Launch Week, we're shipping features that make Postgres even more powerful for AI-driven apps. Vector Search is now in public beta, so you can build semantic search directly inside your database without extra services. We've also updated Edge Functions with 10x faster cold starts and added new auth flows for better user experience.

This week:
• Day 1: Vector Search Beta
• Day 2: Edge Functions v2
• Day 3: Realtime Broadcast Channels
• Day 4: Auth Enhancements
• Day 5: Dashboard 2.0

→ Read all announcements`

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm mb-8">
              <FileText className="mr-2 h-4 w-4 text-accent" />
              Content Library
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent mb-6">
              Launch Content Samples
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-4xl mx-auto leading-relaxed">
              Sample blog posts, newsletters, and social content for Supabase launches
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Blog Post Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-6 w-6 text-accent" />
              Launch Announcement: Vector Search Beta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <div className="bg-background/50 border border-border/30 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
                {blogPostContent}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => copyToClipboard(blogPostContent, 'Blog Post')}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copiedItem === 'Blog Post' ? 'Copied!' : 'Copy Post'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Variants Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Share2 className="h-6 w-6 text-blue-500" />
              Multi-Channel Social Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Twitter Card */}
              <Card className="border-border/30 bg-background/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    Twitter/X
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-sm">
                    {twitterContent}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(twitterContent, 'Twitter Post')}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedItem === 'Twitter Post' ? 'Copied!' : 'Copy'}
                  </Button>
                </CardContent>
              </Card>

              {/* LinkedIn Card */}
              <Card className="border-border/30 bg-background/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    LinkedIn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-sm">
                    {linkedinContent}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(linkedinContent, 'LinkedIn Post')}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedItem === 'LinkedIn Post' ? 'Copied!' : 'Copy'}
                  </Button>
                </CardContent>
              </Card>

              {/* Hacker News Card */}
              <Card className="border-border/30 bg-background/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="h-5 w-5 bg-orange-500 rounded-sm flex items-center justify-center text-xs font-bold text-white">
                      HN
                    </div>
                    Hacker News
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-sm">
                    {hackerNewsContent}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(hackerNewsContent, 'Hacker News Post')}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedItem === 'Hacker News Post' ? 'Copied!' : 'Copy'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Mail className="h-6 w-6 text-purple-500" />
              Monthly Newsletter Intro
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-background/50 border border-border/30 rounded-lg p-6 text-sm whitespace-pre-wrap font-mono">
              {newsletterContent}
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => copyToClipboard(newsletterContent, 'Newsletter')}
                className="bg-purple-500 hover:bg-purple-500/90 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copiedItem === 'Newsletter' ? 'Copied!' : 'Copy Newsletter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}