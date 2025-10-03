'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Calendar, ExternalLink, Database, Zap, Radio, Shield, Layout, ChevronRight, ArrowDown, Code2 } from 'lucide-react'
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
  {
    id: 'interactive-sandbox',
    title: 'Interactive Launch Sandbox',
    description: 'Prototype hands-on playground for trying Supabase features live',
    icon: <Code2 className="h-6 w-6" />,
    day: 6,
    status: 'shipped',
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

[Read the full documentation →](https://supabase.com/docs/guides/ai/vector)
`

export default function LaunchWeekPage() {
  const [selectedFeature, setSelectedFeature] = useState<LaunchFeature | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [cardsInView, setCardsInView] = useState<boolean[]>(new Array(launchFeatures.length).fill(false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardsInView(prev => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        },
        { threshold: 0.2, rootMargin: '50px' }
      )
      
      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  const openAnnouncement = (feature: LaunchFeature) => {
    if (feature.id === 'interactive-sandbox') {
      router.push('/sandbox')
      return
    }
    
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
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(62, 207, 142, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 16px rgba(62, 207, 142, 0.5);
            transform: scale(1.02);
          }
        }
        
        @keyframes badge-pulse {
          0%, 100% {
            background-color: #3ECF8E;
            transform: scale(1);
          }
          50% {
            background-color: #2DB574;
            transform: scale(1.05);
          }
        }
        
        .animated-gradient {
          background: linear-gradient(
            -45deg,
            #ffffff,
            #f0f0f0,
            #3ECF8E,
            #ffffff,
            #e0e0e0,
            #3ECF8E
          );
          background-size: 400% 400%;
          animation: gradient-shift 6s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-entrance {
          animation: fade-slide-up 0.8s ease-out forwards;
        }
        
        .card-entrance-delay-1 { animation-delay: 0.1s; }
        .card-entrance-delay-2 { animation-delay: 0.2s; }
        .card-entrance-delay-3 { animation-delay: 0.3s; }
        .card-entrance-delay-4 { animation-delay: 0.4s; }
        
        .hover-glow:hover {
          animation: pulse-glow 2s infinite;
        }
        
        .badge-animate:hover {
          animation: badge-pulse 1s infinite;
        }
        
        .floating-bg {
          background: radial-gradient(circle at 20% 80%, rgba(62, 207, 142, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(62, 207, 142, 0.1) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border-b border-border min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="floating-bg absolute inset-0" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-base mb-12 shadow-lg">
              <Calendar className="mr-3 h-5 w-5 text-accent" />
              October 6–10, 2025
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold animated-gradient mb-8 leading-none px-4">
              Launch Week 15
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-muted mb-10 max-w-4xl mx-auto font-light px-4">
              5 days of new features, demos, and updates
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-muted/80 mb-16 max-w-3xl mx-auto leading-relaxed px-4">
              Join us as we unveil the latest innovations in the Supabase ecosystem. 
              From AI-powered features to performance improvements, this week has it all.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 px-4">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-5 bg-accent hover:bg-accent/90 text-background font-semibold">
                View All Announcements
                <ChevronRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-5 border-accent text-accent hover:bg-accent/10">
                Subscribe for Updates
              </Button>
            </div>
            
            <div className="animate-bounce">
              <ArrowDown className="h-6 w-6 text-accent mx-auto" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {launchFeatures.map((feature, index) => (
            <Card 
              key={feature.id}
              ref={el => { cardRefs.current[index] = el; return undefined; }}
              className={`group hover-glow transition-all duration-500 ${feature.id === 'vector-search' ? 'cursor-default' : 'cursor-pointer'} border-border hover:border-accent/50 relative overflow-hidden ${
                cardsInView[index] 
                  ? `card-entrance card-entrance-delay-${index}` 
                  : 'opacity-0 translate-y-8'
              }`}
              onClick={feature.id === 'vector-search' ? undefined : () => openAnnouncement(feature)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="p-6 sm:p-8 relative">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110 shrink-0">
                      {feature.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-background mb-2 badge-animate ${
                        feature.status === 'shipped' 
                          ? 'bg-accent shadow-lg' 
                          : 'bg-muted'
                      }`}>
                        Day {feature.day}
                      </div>
                      <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        feature.status === 'shipped' 
                          ? 'bg-accent/20 text-accent border border-accent/30' 
                          : 'bg-muted/20 text-muted border border-muted/30'
                      }`}>
                        {feature.status === 'shipped' ? '✓ Shipped' : 'Coming Soon'}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-accent transition-colors duration-300 leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-muted mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group-hover:border-accent group-hover:text-accent group-hover:bg-accent/5 transition-all duration-300 font-medium w-full sm:w-auto"
                    disabled={feature.status === 'coming-soon' && !feature.hasFullAnnouncement}
                  >
                    {feature.id === 'interactive-sandbox' ? 'Try Sandbox' : 
                     feature.status === 'coming-soon' ? 'Coming Soon' : 'Read Announcement'}
                    <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  {index === 0 && (
                    <div className="inline-flex items-center justify-center sm:justify-start px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20">
                      ✨ Featured
                    </div>
                  )}
                  {feature.id === 'interactive-sandbox' && (
                    <div className="inline-flex items-center justify-center sm:justify-start px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/30">
                      🧪 Prototype
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 rounded-2xl p-8 sm:p-12 border border-accent/20">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Don&apos;t Miss a Single Update
            </h3>
            <p className="text-base sm:text-lg text-muted mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Get notified about each launch as it happens. Join thousands of developers following along.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-accent hover:bg-accent/90 text-background font-semibold">
                Subscribe to Updates
              </Button>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-accent text-accent hover:bg-accent/10">
                Follow on Twitter
              </Button>
            </div>
          </div>
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