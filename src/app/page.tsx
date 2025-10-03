'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { supabase, Launch, ActivityLog } from '@/lib/supabase'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { TrendingUp, Clock, CheckCircle, Users, Plus, Sparkles, BarChart3, Code2, Terminal, Rocket, Zap, ChevronRight, Play } from 'lucide-react'

export default function Dashboard() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [launchesRes, activitiesRes] = await Promise.all([
        supabase.from('launches').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(8)
      ])

      if (launchesRes.data) setLaunches(launchesRes.data)
      if (activitiesRes.data) setActivities(activitiesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    active: launches.filter(l => l.status === 'In Progress').length,
    completed: launches.filter(l => l.status === 'Shipped').length,
    inProgress: launches.filter(l => l.status === 'In Progress' || l.status === 'Ready').length,
    upcoming: launches.filter(l => l.status === 'Planning').length,
  }

  const upcomingLaunches = launches
    .filter(l => l.launch_date && new Date(l.launch_date) > new Date())
    .sort((a, b) => new Date(a.launch_date!).getTime() - new Date(b.launch_date!).getTime())
    .slice(0, 4)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping delay-500" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-ping delay-1500" />
      </div>

      <div className="relative z-10 space-y-12">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm mb-8 shadow-lg">
            <Terminal className="mr-3 h-4 w-4 text-accent" />
            <span className="text-accent font-medium">Live Dashboard</span>
            <div className="ml-3 h-2 w-2 bg-accent rounded-full animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent mb-6 leading-tight">
            Launch Week Command Center
          </h1>
          
          <p className="text-xl text-muted max-w-3xl mx-auto mb-12 leading-relaxed">
            Manage launches, view stats, and explore features with real-time insights and AI-powered tools
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/launches?action=new">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-background font-semibold px-8 py-4 shadow-lg hover:shadow-accent/25 transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Create Launch
              </Button>
            </Link>
            <Link href="/sandbox">
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 px-8 py-4">
                <Code2 className="mr-2 h-5 w-5" />
                View Sandbox
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="group hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                      <p className="text-sm font-medium text-muted">Active Launches</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground group-hover:text-accent transition-colors">{stats.active}</p>
                    <p className="text-xs text-muted mt-1 font-mono">status: running</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-sm font-medium text-muted">Shipped This Month</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground group-hover:text-green-500 transition-colors">{stats.completed}</p>
                    <p className="text-xs text-muted mt-1 font-mono">$ git push --production</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                      <p className="text-sm font-medium text-muted">In Progress</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground group-hover:text-yellow-500 transition-colors">{stats.inProgress}</p>
                    <p className="text-xs text-muted mt-1 font-mono">npm run build --watch</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                      <p className="text-sm font-medium text-muted">Queued</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground group-hover:text-blue-500 transition-colors">{stats.upcoming}</p>
                    <p className="text-xs text-muted mt-1 font-mono">await queue.next()</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Panels */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Code Console Panel */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Terminal className="h-5 w-5 text-accent" />
                    Launch Console
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted font-mono">online</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-background/50 border border-border/30 rounded-b-lg">
                  <div className="p-4 font-mono text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-accent">→</span>
                      <span className="text-muted">supabase status</span>
                    </div>
                    <div className="text-green-500 ml-4">✓ Database: Connected</div>
                    <div className="text-green-500 ml-4">✓ Auth: Active</div>
                    <div className="text-yellow-500 ml-4">⚡ Edge Functions: Deploying...</div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-accent">→</span>
                      <span className="text-muted">npm run launch-week</span>
                    </div>
                    <div className="text-blue-500 ml-4">[info] Starting launch sequence...</div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent animate-pulse">→</span>
                      <span className="h-2 w-2 bg-accent rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Feed */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-muted" />
                    </div>
                    <p className="text-muted">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex items-start gap-3 group">
                        <div className={`h-2 w-2 rounded-full mt-2 ${
                          index === 0 ? 'bg-accent animate-pulse' : 'bg-muted/50'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm">
                              {activity.user_name}
                            </span>
                            <span className="text-muted text-sm">{activity.action}</span>
                          </div>
                          <p className="text-xs text-muted font-mono">
                            {formatRelativeTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Launches - Redesigned */}
        <div className="mx-auto max-w-7xl px-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Rocket className="h-6 w-6 text-purple-500" />
                  Launch Pipeline
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-xs text-muted font-mono">{upcomingLaunches.length} queued</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingLaunches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="h-8 w-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No launches in pipeline</h3>
                  <p className="text-muted mb-6">Schedule your next feature launch to get started</p>
                  <Link href="/launches?action=new">
                    <Button className="bg-accent hover:bg-accent/90 text-background">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Launch
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingLaunches.map((launch, index) => (
                    <div key={launch.id} className="group p-4 border border-border/50 rounded-lg hover:border-accent/30 hover:bg-accent/5 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${
                              index === 0 ? 'bg-accent animate-pulse' : 'bg-muted/50'
                            }`} />
                            <div className="h-8 w-8 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-500">{index + 1}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {launch.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted">
                              <span className="font-mono">
                                {launch.launch_date ? formatDate(launch.launch_date) : 'TBD'}
                              </span>
                              <span>•</span>
                              <span>{launch.owner}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {launch.status}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Redesigned */}
        <div className="mx-auto max-w-7xl px-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-accent" />
                Developer Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/launches?action=new" className="group">
                  <div className="h-32 p-6 border border-border/50 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                        <Plus className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                          New Launch
                        </h3>
                        <p className="text-xs text-muted font-mono">init --template</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/assistant" className="group">
                  <div className="h-32 p-6 border border-border/50 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/20 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
                        <Sparkles className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-purple-500 transition-colors">
                          AI Assistant
                        </h3>
                        <p className="text-xs text-muted font-mono">generate --content</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/sandbox" className="group">
                  <div className="h-32 p-6 border border-border/50 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/20 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                        <Play className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                          Sandbox
                        </h3>
                        <p className="text-xs text-muted font-mono">npm start --dev</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/the-grid" className="group">
                  <div className="h-32 p-6 border border-border/50 rounded-xl bg-gradient-to-br from-orange-500/5 to-orange-500/10 hover:from-orange-500/10 hover:to-orange-500/20 transition-all duration-300 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
                        <Users className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-orange-500 transition-colors">
                          The Grid
                        </h3>
                        <p className="text-xs text-muted font-mono">join --community</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with Dynamic Elements */}
        <div className="relative mt-24 py-16">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm text-muted font-mono">System Status: Operational</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted font-mono">Launch Week 15: Ready</span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}