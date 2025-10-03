'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Sparkles, 
  FileText, 
  Share2, 
  Code, 
  HelpCircle, 
  BarChart3,
  Copy,
  Check,
  X,
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface AIActionCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface GeneratedResult {
  id: string
  type: string
  title: string
  content: string | { platform: string; content: string }[]
  timestamp: string
}

const aiActions: AIActionCard[] = [
  {
    id: 'announcement',
    title: 'Generate Launch Announcement',
    description: 'Create a compelling announcement for your feature launch',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-accent'
  },
  {
    id: 'social',
    title: 'Create Social Media Variants',
    description: 'Generate platform-specific social media content',
    icon: <Share2 className="h-6 w-6" />,
    color: 'bg-blue-500'
  },
  {
    id: 'developer',
    title: 'Write Developer Angle',
    description: 'Create technical messaging focused on developers',
    icon: <Code className="h-6 w-6" />,
    color: 'bg-purple-500'
  },
  {
    id: 'faq',
    title: 'Generate FAQ',
    description: 'Create comprehensive frequently asked questions',
    icon: <HelpCircle className="h-6 w-6" />,
    color: 'bg-orange-500'
  },
  {
    id: 'competitive',
    title: 'Competitive Analysis',
    description: 'Analyze positioning against competitors',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'bg-pink-500'
  },
]

const mockResponses = {
  announcement: `# Introducing Edge Functions v2: 10x Faster Cold Starts

We've rebuilt Edge Functions from the ground up. New runtime delivers sub-50ms cold starts and improved memory efficiency.

**What's new:**
- 10x faster cold start times
- Global deployment in 35+ regions
- New Node.js 20 runtime
- Improved logging and debugging

**Try it now:**
Deploy your first function in seconds:

\`\`\`javascript
export default async (req) => {
  return new Response('Hello from the edge!')
}
\`\`\`

Deploy with: \`supabase functions deploy\``,

  social: [
    {
      platform: 'Twitter',
      content: `Edge Functions v2 is live 🚀

10x faster cold starts, global deployment, new runtime.

Ship serverless functions at the edge in seconds.

→ supabase.com/docs`
    },
    {
      platform: 'LinkedIn',
      content: `Excited to announce Edge Functions v2. We've rebuilt our serverless platform from the ground up with 10x faster cold starts and deployment to 35+ regions worldwide. Perfect for building real-time APIs and webhooks.`
    },
    {
      platform: 'Dev.to',
      content: `Edge Functions v2 launched today:

• Sub-50ms cold starts
• Node.js 20 runtime  
• Global edge deployment

Docs: supabase.com/docs/functions`
    }
  ],

  developer: `Sample developer-focused content would appear here. In production, this integrates Claude API for real generation.`,
  faq: `Sample FAQ content would appear here. In production, this integrates Claude API for real generation.`,
  competitive: `Sample competitive analysis would appear here. In production, this integrates Claude API for real generation.`
}

export default function AssistantPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<GeneratedResult[]>([])
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({})

  const handleGenerate = async (actionId: string, actionTitle: string) => {
    setLoadingStates(prev => ({ ...prev, [actionId]: true }))
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newResult: GeneratedResult = {
      id: `${actionId}-${Date.now()}`,
      type: actionId,
      title: actionTitle,
      content: mockResponses[actionId as keyof typeof mockResponses],
      timestamp: new Date().toLocaleTimeString()
    }
    
    setResults(prev => [newResult, ...prev])
    setLoadingStates(prev => ({ ...prev, [actionId]: false }))
  }

  const copyToClipboard = async (text: string, resultId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => ({ ...prev, [resultId]: true }))
      toast.success('Copied to clipboard!', {
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
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [resultId]: false }))
      }, 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const dismissResult = (resultId: string) => {
    setResults(prev => prev.filter(result => result.id !== resultId))
  }

  const clearAllResults = () => {
    setResults([])
    setCopiedItems({})
  }

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-background/80 px-2 py-1 rounded text-sm font-mono border border-border/30">$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-background/80 border border-border/30 rounded-lg p-4 overflow-x-auto my-4"><code class="font-mono text-sm">$2</code></pre>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-b border-accent/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-accent">
              AI Assistant in demo mode - showing mock responses instead of live API calls
            </span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm mb-8">
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              AI Content Generator
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent mb-6">
              AI Assistant
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-4xl mx-auto leading-relaxed">
              Generate high-quality content for your launches using AI. Choose from pre-built templates 
              or create custom content tailored to your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Clear All Button */}
        {results.length > 0 && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={clearAllResults}
              className="text-red-400 border-red-400/30 hover:bg-red-400/10 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Results
            </Button>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiActions.map((action) => (
            <Card 
              key={action.id} 
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white group-hover:scale-110 transition-all ${action.color}`}>
                    {action.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors">
                      {action.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted text-sm mb-6">{action.description}</p>
                <Button 
                  onClick={() => handleGenerate(action.id, action.title)}
                  disabled={loadingStates[action.id]}
                  className="w-full bg-accent hover:bg-accent/90 text-background font-medium"
                >
                  {loadingStates[action.id] ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Generated Content</h2>
            
            {results.map((result) => (
              <Card key={result.id} className="border-border/50 bg-[#1A1F2E] backdrop-blur-sm">
                <CardHeader className="border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{result.title}</CardTitle>
                      <p className="text-sm text-muted mt-1">Generated at {result.timestamp}</p>
                    </div>
                    <button
                      onClick={() => dismissResult(result.id)}
                      className="text-muted hover:text-white transition-colors p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {Array.isArray(result.content) ? (
                    // Social media variants
                    <div className="space-y-6">
                      {result.content.map((variant, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white">{variant.platform}</h4>
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(variant.content, `${result.id}-${index}`)}
                              className="bg-accent hover:bg-accent/90 text-background"
                            >
                              {copiedItems[`${result.id}-${index}`] ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="bg-background/50 border border-border/30 rounded-lg p-4">
                            <div className="text-white text-sm whitespace-pre-wrap">
                              {variant.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single content block
                    <div className="space-y-4">
                      <div className="bg-background/50 border border-border/30 rounded-lg p-6">
                        <div 
                          className="text-white text-sm leading-relaxed prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: `<p class="mb-4">${formatContent(result.content as string)}</p>` 
                          }}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => copyToClipboard(result.content as string, result.id)}
                          className="bg-accent hover:bg-accent/90 text-background"
                        >
                          {copiedItems[result.id] ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}