'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Calendar, ExternalLink, Database, Zap, Radio, Shield, Layout, ChevronRight } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface LaunchFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  day: number
  status: 'shipped' | 'coming-soon'
  hasFullAnnouncement?: boolean
}

const launchFeatures: LaunchFeature[] = [
  {
    id: 'vector-search',
    title: 'Vector Search in Postgres',
    description: 'Build semantic search directly in your database with pgvector',
    icon: <Database className="h-6 w-6" />,
    day: 1,
    status: 'shipped',
    hasFullAnnouncement: true,
  },
  {
    id: 'edge-functions-v2',
    title: 'Edge Functions: Now 10x Faster',
    description: 'New runtime with improved cold starts and global deployment',
    icon: <Zap className="h-6 w-6" />,
    day: 2,
    status: 'shipped',
    hasFullAnnouncement: false,
  },
  {
    id: 'realtime-broadcast',
    title: 'Realtime Broadcast Channels',
    description: 'Build multiplayer experiences with low-latency messaging',
    icon: <Radio className="h-6 w-6" />,
    day: 3,
    status: 'coming-soon',
    hasFullAnnouncement: false,
  },
  {
    id: 'auth-enhancements',
    title: 'Anonymous Sign-ins & MFA Updates',
    description: 'New auth flows for better user experience',
    icon: <Shield className="h-6 w-6" />,
    day: 4,
    status: 'coming-soon',
    hasFullAnnouncement: false,
  },
  {
    id: 'dashboard-redesign',
    title: 'Dashboard 2.0: Built for Scale',
    description: 'Redesigned UI for managing production databases',
    icon: <Layout className="h-6 w-6" />,
    day: 5,
    status: 'coming-soon',
    hasFullAnnouncement: false,
  },
]

const vectorSearchContent = `
# Vector Search in Postgres

Vector search is now natively supported in Supabase with pgvector. Build semantic search, recommendations, and AI-powered features directly in your PostgreSQL database.

## Key Features

- **Native PostgreSQL Integration**: pgvector extension built into every Supabase database
- **High Performance**: Optimized indexing with HNSW and IVF algorithms
- **Flexible Embeddings**: Support for OpenAI, Cohere, and custom embedding models
- **SQL-First Approach**: Use familiar SQL queries for vector operations

## Quick Start

Enable the pgvector extension and create your first vector table:

\`\`\`sql
-- Enable the pgvector extension
create extension if not exists vector;

-- Create a table to store documents with embeddings
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536)
);

-- Create an index for fast similarity search
create index on documents using hnsw (embedding vector_cosine_ops);
\`\`\`

## Semantic Search Example

Here's how to implement semantic search with OpenAI embeddings:

\`\`\`javascript
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(url, key)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function semanticSearch(query, matchThreshold = 0.8, matchCount = 5) {
  // Generate embedding for the search query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query,
  })
  
  const [{ embedding }] = embeddingResponse.data

  // Search for similar documents
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  })

  return data
}
\`\`\`

## Advanced Use Cases

### Recommendation System
Build product recommendations by finding similar items:

\`\`\`sql
select 
  p.name,
  p.description,
  1 - (p.embedding <=> target.embedding) as similarity
from products p
cross join (
  select embedding from products where id = $1
) as target
where p.id != $1
order by similarity desc
limit 10;
\`\`\`

### Hybrid Search
Combine full-text search with semantic similarity:

\`\`\`sql
select
  content,
  ts_rank(to_tsvector(content), plainto_tsquery($1)) as text_rank,
  1 - (embedding <=> $2) as semantic_similarity,
  (ts_rank(to_tsvector(content), plainto_tsquery($1)) * 0.3 + 
   (1 - (embedding <=> $2)) * 0.7) as combined_score
from documents
where to_tsvector(content) @@ plainto_tsquery($1)
   or (embedding <=> $2) < 0.8
order by combined_score desc;
\`\`\`

## Performance & Scaling

Vector search in Supabase is production-ready with:

- **Sub-millisecond queries** for million+ vector datasets
- **Automatic index optimization** based on your data distribution  
- **Connection pooling** to handle high concurrency
- **Read replicas** for geo-distributed search

## Getting Started

Vector search is available today on all Supabase projects. Check out our documentation for implementation guides and best practices.

[Read the full documentation →](https://supabase.com/docs/guides/ai/vector-search)
`

export default function LaunchWeekPage() {
  const [selectedFeature, setSelectedFeature] = useState<LaunchFeature | null>(null)
  const [showModal, setShowModal] = useState(false)

  const openAnnouncement = (feature: LaunchFeature) => {
    setSelectedFeature(feature)
    if (feature.hasFullAnnouncement) {
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedFeature(null)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-b border-border">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm mb-8">
              <Calendar className="mr-2 h-4 w-4 text-accent" />
              December 9-13, 2024
            </div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
              Launch Week 12
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto">
              5 days of new features, demos, and updates
            </p>
            <p className="text-lg text-muted/80 mb-12 max-w-2xl mx-auto">
              Join us as we unveil the latest innovations in the Supabase ecosystem. 
              From AI-powered features to performance improvements, this week has it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                View All Announcements
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Subscribe for Updates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">This Week&apos;s Releases</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Each day brings new capabilities to help you build faster and scale further with Supabase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {launchFeatures.map((feature, index) => (
            <Card 
              key={feature.id}
              className="group hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 cursor-pointer border-border hover:border-accent/30 relative overflow-hidden"
              onClick={() => openAnnouncement(feature)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                      {feature.icon}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-muted">Day {feature.day}</div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        feature.status === 'shipped' 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-muted/10 text-muted'
                      }`}>
                        {feature.status === 'shipped' ? '✓ Shipped' : 'Coming Soon'}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted mb-6 line-clamp-2">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group-hover:border-accent group-hover:text-accent"
                    disabled={feature.status === 'coming-soon' && !feature.hasFullAnnouncement}
                  >
                    {feature.status === 'coming-soon' ? 'Coming Soon' : 'Read Announcement'}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                  
                  {index === 0 && (
                    <div className="text-xs text-accent font-medium">
                      ✨ Featured
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-3xl font-bold text-accent mb-2">5</div>
              <div className="text-muted">Major Features</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-3xl font-bold text-accent mb-2">100K+</div>
              <div className="text-muted">Developers Watching</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="text-3xl font-bold text-accent mb-2">∞</div>
              <div className="text-muted">Possibilities Unlocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Announcement Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={selectedFeature?.title || ''}
        size="xl"
      >
        {selectedFeature?.id === 'vector-search' && (
          <div className="prose prose-lg max-w-none">
            <div className="space-y-6">
              {vectorSearchContent.split('\n\n').map((section, index) => {
                if (section.startsWith('```')) {
                  const code = section.replace(/```\w*\n?/g, '').trim()
                  const language = section.match(/```(\w+)/)?.[1] || 'javascript'
                  
                  return (
                    <div key={index} className="rounded-lg overflow-hidden border border-border">
                      <SyntaxHighlighter
                        language={language}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          background: '#1A1F2E',
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  )
                }
                
                if (section.startsWith('#')) {
                  const level = section.match(/^#+/)?.[0].length || 1
                  const text = section.replace(/^#+\s*/, '')
                  const HeadingTag = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
                  
                  return (
                    <HeadingTag 
                      key={index} 
                      className={`font-bold ${
                        level === 1 ? 'text-2xl mb-4' : 
                        level === 2 ? 'text-xl mb-3 mt-8' : 
                        'text-lg mb-2 mt-6'
                      }`}
                    >
                      {text}
                    </HeadingTag>
                  )
                }
                
                return (
                  <p key={index} className="text-foreground leading-relaxed">
                    {section}
                  </p>
                )
              })}
              
              <div className="flex gap-4 pt-8 border-t border-border">
                <Button variant="primary" className="flex-1">
                  Try Vector Search Now
                </Button>
                <Button variant="outline" className="flex-1">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {selectedFeature && selectedFeature.id !== 'vector-search' && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-4">
              {selectedFeature.icon}
            </div>
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-muted">
              Full announcement for {selectedFeature.title} will be available soon.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}