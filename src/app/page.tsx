'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { supabase, Launch, ActivityLog } from '@/lib/supabase'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { TrendingUp, Clock, CheckCircle, Users, Plus, Sparkles, BarChart3 } from 'lucide-react'

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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted">Welcome to your Launch Week Command Center</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted">Active Launches</p>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
              </div>
              <div className="h-8 w-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted">Completed This Month</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
              <div className="h-8 w-8 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              </div>
              <div className="h-8 w-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted">Upcoming</p>
                <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
              </div>
              <div className="h-8 w-8 bg-muted/10 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Launches Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Launches</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingLaunches.length === 0 ? (
            <p className="text-muted text-center py-8">No upcoming launches scheduled</p>
          ) : (
            <div className="space-y-4">
              {upcomingLaunches.map((launch) => (
                <div key={launch.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <div>
                      <h3 className="font-medium text-foreground">{launch.title}</h3>
                      <p className="text-sm text-muted">
                        {launch.launch_date ? formatDate(launch.launch_date) : 'No date set'} • {launch.owner}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{launch.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/launches?action=new">
              <Button className="w-full h-auto p-6 flex-col space-y-2" variant="primary">
                <Plus className="h-6 w-6" />
                <span>Add New Launch</span>
              </Button>
            </Link>
            <Link href="/assistant">
              <Button className="w-full h-auto p-6 flex-col space-y-2" variant="primary">
                <Sparkles className="h-6 w-6" />
                <span>Generate Content with AI</span>
              </Button>
            </Link>
            <Link href="/launches">
              <Button className="w-full h-auto p-6 flex-col space-y-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span>View All Launches</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-muted text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-accent mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user_name}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted">{formatRelativeTime(activity.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}