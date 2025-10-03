'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Hash, 
  TrendingUp, 
  Sparkles, 
  Code2, 
  Database, 
  Zap, 
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  upvotes: number
  downvotes: number
  comments: Comment[]
  timestamp: string
  userVote?: 'up' | 'down' | null
}

interface Comment {
  id: string
  content: string
  author: string
  timestamp: string
  upvotes: number
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Built a real-time chat with Supabase Realtime + Next.js',
    content: `Just shipped a Discord-like chat app using Supabase Realtime channels. The DX is incredible - went from idea to working prototype in 2 hours.

Key learnings:
- Broadcast channels are perfect for ephemeral data
- RLS policies work seamlessly with realtime
- Edge Functions handle message filtering

\`\`\`typescript
const channel = supabase.channel('chat-room')
  .on('broadcast', { event: 'message' }, (payload) => {
    setMessages(prev => [...prev, payload])
  })
\`\`\`

Anyone else building real-time features? Would love to hear your approaches!`,
    author: 'alex_dev',
    category: 'Realtime',
    upvotes: 47,
    downvotes: 2,
    timestamp: '2 hours ago',
    userVote: null,
    comments: [
      {
        id: 'c1',
        content: 'This is awesome! I built something similar but used presence for user indicators. How are you handling message history?',
        author: 'sarah_codes',
        timestamp: '1 hour ago',
        upvotes: 12
      },
      {
        id: 'c2',
        content: 'Nice work! The RLS + Realtime combo is really powerful. I use it for collaborative docs.',
        author: 'mike_builds',
        timestamp: '45 minutes ago',
        upvotes: 8
      }
    ]
  },
  {
    id: '2',
    title: 'Vector similarity search for code snippets - mind blown 🤯',
    content: `Experimenting with pgvector to build semantic search for code snippets. You can now search "authentication middleware" and it finds relevant Express/Next.js auth code even if those exact words aren't in the snippet.

The setup was surprisingly simple:
1. Generate embeddings with OpenAI
2. Store in vector column 
3. Query with cosine similarity

Performance is incredible even with 10k+ snippets. Has anyone tried this for documentation search?`,
    author: 'emma_ai',
    category: 'Vector Search',
    upvotes: 89,
    downvotes: 1,
    timestamp: '4 hours ago',
    userVote: 'up',
    comments: [
      {
        id: 'c3',
        content: 'This is the future! I want to build this for my team\'s internal docs. Any tips on chunking strategies?',
        author: 'dev_tom',
        timestamp: '3 hours ago',
        upvotes: 15
      }
    ]
  },
  {
    id: '3',
    title: 'Edge Functions cold start optimization tricks',
    content: `After deploying 50+ Edge Functions, here are my top performance tips:

🚀 **Initialization tricks:**
- Pre-import heavy libraries outside handler
- Use global variables for DB connections
- Implement connection pooling

⚡ **Bundle optimization:**
- Tree-shake unused exports  
- Use dynamic imports for conditional code
- Keep dependencies minimal

📊 **Results:** Reduced cold starts from ~300ms to ~50ms

Share your Edge Functions performance tips below!`,
    author: 'perf_guru',
    category: 'Edge Functions',
    upvotes: 156,
    downvotes: 3,
    timestamp: '6 hours ago',
    userVote: null,
    comments: []
  },
  {
    id: '4',
    title: 'Row Level Security patterns for SaaS apps',
    content: `Building a multi-tenant SaaS and RLS is a game changer. Here's my policy setup:

\`\`\`sql
-- Users can only see their org's data
CREATE POLICY "org_isolation" ON documents
  FOR ALL USING (org_id = auth.jwt() ->> 'org_id');

-- Admins can manage all org data  
CREATE POLICY "admin_access" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND org_id = documents.org_id
    )
  );
\`\`\`

Zero application-level filtering needed. Security at the database level is so clean.`,
    author: 'security_sam',
    category: 'Database',
    upvotes: 73,
    downvotes: 0,
    timestamp: '8 hours ago',
    userVote: null,
    comments: [
      {
        id: 'c4',
        content: 'RLS is amazing! One gotcha: make sure to test policies thoroughly. I had a bug where admins couldn\'t see data.',
        author: 'cautious_dev',
        timestamp: '7 hours ago',
        upvotes: 22
      }
    ]
  }
]

const categories = [
  { name: 'All', icon: Hash, color: 'text-accent' },
  { name: 'Edge Functions', icon: Zap, color: 'text-yellow-500' },
  { name: 'Vector Search', icon: Database, color: 'text-blue-500' },
  { name: 'Realtime', icon: TrendingUp, color: 'text-green-500' },
  { name: 'Database', icon: Database, color: 'text-purple-500' },
]

export default function TheGridPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedComments, setExpandedComments] = useState<string[]>([])

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post }
        
        // Remove previous vote if exists
        if (post.userVote === 'up') newPost.upvotes--
        if (post.userVote === 'down') newPost.downvotes--
        
        // Add new vote if different from current
        if (post.userVote !== voteType) {
          if (voteType === 'up') newPost.upvotes++
          if (voteType === 'down') newPost.downvotes++
          newPost.userVote = voteType
        } else {
          newPost.userVote = null
        }
        
        return newPost
      }
      return post
    }))
  }

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm mb-8">
              <Users className="mr-2 h-4 w-4 text-accent" />
              Community Hub
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent mb-6">
              The Grid
            </h1>
            
            <p className="text-lg md:text-xl text-muted max-w-4xl mx-auto leading-relaxed">
              A space for developers to share ideas, mini-projects, and discuss Supabase features.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Categories Filter */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all hover:bg-accent/10 ${
                      selectedCategory === category.name 
                        ? 'bg-accent/20 text-accent border border-accent/30' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <category.icon className={`h-4 w-4 ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                  <p className="text-sm text-muted mb-2">💡 Trending topic:</p>
                  <p className="text-sm font-medium text-accent">Vector embeddings for search</p>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm text-muted mb-2">🔥 Popular this week:</p>
                  <p className="text-sm font-medium text-blue-500">Edge Functions optimization</p>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                  <p className="text-sm text-muted mb-2">✨ Check out:</p>
                  <p className="text-sm font-medium text-purple-500">Real-time collaboration patterns</p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* New Post Button */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <Button className="w-full bg-accent hover:bg-accent/90 text-background">
                  <Code2 className="mr-2 h-4 w-4" />
                  Share your project or idea
                </Button>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {filteredPosts.map((post) => (
              <Card key={post.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex flex-col items-center space-y-1">
                      <button
                        onClick={() => handleVote(post.id, 'up')}
                        className={`p-1 rounded transition-colors ${
                          post.userVote === 'up' 
                            ? 'text-accent bg-accent/20' 
                            : 'text-muted hover:text-accent hover:bg-accent/10'
                        }`}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-bold text-foreground">
                        {post.upvotes - post.downvotes}
                      </span>
                      <button
                        onClick={() => handleVote(post.id, 'down')}
                        className={`p-1 rounded transition-colors ${
                          post.userVote === 'down' 
                            ? 'text-red-500 bg-red-500/20' 
                            : 'text-muted hover:text-red-500 hover:bg-red-500/10'
                        }`}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">u/{post.author}</span>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-muted">{post.timestamp}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.category === 'Edge Functions' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                          post.category === 'Vector Search' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' :
                          post.category === 'Realtime' ? 'bg-green-500/10 text-green-500 border border-green-500/30' :
                          'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                        }`}>
                          {post.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      
                      <div className="prose prose-invert prose-sm max-w-none">
                        <div className="text-muted whitespace-pre-wrap text-sm leading-relaxed">
                          {post.content}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments.length} comments</span>
                      {expandedComments.includes(post.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    <button className="flex items-center gap-2 text-muted hover:text-accent transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-muted hover:text-accent transition-colors">
                      <Bookmark className="h-4 w-4" />
                      <span className="text-sm">Save</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.includes(post.id) && (
                    <div className="mt-6 pl-6 border-l-2 border-border/30 space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-background/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-foreground">u/{comment.author}</span>
                            <span className="text-xs text-muted">•</span>
                            <span className="text-xs text-muted">{comment.timestamp}</span>
                            <div className="flex items-center gap-1 ml-auto">
                              <ArrowUp className="h-3 w-3 text-muted" />
                              <span className="text-xs text-muted">{comment.upvotes}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                      
                      {/* Add Comment */}
                      <div className="bg-background/30 rounded-lg p-4">
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <textarea
                              placeholder="Add a comment..."
                              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button size="sm" className="bg-accent hover:bg-accent/90 text-background">
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}