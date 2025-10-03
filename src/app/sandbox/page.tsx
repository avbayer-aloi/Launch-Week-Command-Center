'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Play, Sparkles, Share, Heart, Send, Code2, Users, Trophy } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const defaultCode = `-- Create a table with a vector column
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536)
);

-- Create an index for fast similarity search
create index on documents using hnsw (embedding vector_cosine_ops);

-- Insert sample data
insert into documents (content, embedding) values
  ('Supabase is amazing', '[0.1, 0.2, 0.3, ...]'),
  ('Building with PostgreSQL', '[0.4, 0.5, 0.6, ...]');

-- Query for similar documents
select 
  content,
  1 - (embedding <=> query_embedding) as similarity
from documents
where 1 - (embedding <=> query_embedding) > 0.8
order by similarity desc;`

const aiMessages = [
  {
    id: 1,
    message: "Need help with semantic search? Try using pgvector with similarity()!",
    timestamp: "2 min ago",
    type: "tip" as const
  },
  {
    id: 2,
    message: "Here's a starter snippet in Next.js for calling your Supabase function.",
    timestamp: "5 min ago",
    type: "code" as const
  },
  {
    id: 3,
    message: "💡 Tip of the day: Supabase Auth + Row Level Security = unstoppable combo.",
    timestamp: "10 min ago",
    type: "tip" as const
  },
  {
    id: 4,
    message: "😄 Fun fact: our green is #3ECF8E. Looks good on you.",
    timestamp: "15 min ago",
    type: "fun" as const
  }
]

export default function SandboxPage() {
  const [code, setCode] = useState(defaultCode)
  const [isRunning, setIsRunning] = useState(false)
  const [aiInput, setAiInput] = useState('')

  const handleRunCode = async () => {
    setIsRunning(true)
    
    // Simulate running code
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('🚀 Sandbox is a demo — imagine this spinning up a Supabase project instantly!', {
      duration: 4000,
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
    
    setIsRunning(false)
  }

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim()) return
    
    toast.success('AI assistant is thinking... (demo mode)', {
      duration: 2000,
      style: {
        background: '#1A1F2E',
        color: '#FFFFFF',
        border: '1px solid #3ECF8E',
      },
    })
    
    setAiInput('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm mb-8">
              <Code2 className="mr-2 h-4 w-4 text-accent" />
              Prototype Experience
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent mb-6">
              Interactive Launch Sandbox
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-4xl mx-auto leading-relaxed">
              Spin up a playground where developers can instantly test new Supabase features with AI guidance. 
              This prototype shows how Launch Week could become hands-on: try snippets, get starter code, 
              and share ideas with the community.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Code Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-card border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-accent" />
                    Supabase SQL Playground
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="bg-accent hover:bg-accent/90 text-background"
                      loading={isRunning}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="h-96">
                  <Editor
                    height="100%"
                    defaultLanguage="sql"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                      },
                      automaticLayout: true,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Code Output Mock */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted">Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm">
                  <div className="text-accent mb-2">supabase@sandbox:~$</div>
                  <div className="text-muted">Ready to execute SQL commands...</div>
                  <div className="text-muted mt-2">
                    💡 This is a demo environment. In the real sandbox, 
                    your code would execute against a live Supabase instance.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <Card className="h-fit">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Supabase AI Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground leading-relaxed">
                          {msg.message}
                        </div>
                        <div className="text-xs text-muted mt-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border p-4">
                  <form onSubmit={handleAiSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask about Supabase features..."
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <Button type="submit" size="sm" variant="ghost">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Community Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Active developers</span>
                    <span className="text-sm font-medium text-accent">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Code snippets shared</span>
                    <span className="text-sm font-medium">3,891</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Projects launched</span>
                    <span className="text-sm font-medium">567</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join the Challenge CTA */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <Trophy className="h-8 w-8 text-accent" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                Join the Challenge
              </h3>
              
              <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
                Build something in the sandbox, share it with the community, and get featured in Launch Week.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-background font-semibold">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
                <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10">
                  <Heart className="mr-2 h-5 w-5" />
                  Share Your Build
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">50+</div>
                  <div className="text-sm text-muted">Featured Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">$10K</div>
                  <div className="text-sm text-muted">Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-1">7 Days</div>
                  <div className="text-sm text-muted">Time Left</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}