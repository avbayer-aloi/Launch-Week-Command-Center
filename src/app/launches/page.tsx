'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { supabase, Launch } from '@/lib/supabase'
import { formatDate, getStatusColor, calculateProgress } from '@/lib/utils'
import { Plus, Search, Filter, Edit, Trash2, Calendar } from 'lucide-react'

function LaunchesContent() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingLaunch, setEditingLaunch] = useState<Launch | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planning' as 'Planning' | 'In Progress' | 'Ready' | 'Shipped',
    launch_date: '',
    owner: '',
    tags: '',
    checklist: {
      blog: false,
      demo: false,
      social: false,
      partner: false,
      docs: false,
    }
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchLaunches = async () => {
    try {
      const { data, error } = await supabase
        .from('launches')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        setLaunches(data)
      }
    } catch (error) {
      console.error('Error fetching launches:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLaunches = useCallback(() => {
    let filtered = launches

    if (searchTerm) {
      filtered = filtered.filter(launch =>
        launch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.owner?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(launch => launch.status === statusFilter)
    }

    setFilteredLaunches(filtered)
  }, [launches, searchTerm, statusFilter])

  useEffect(() => {
    fetchLaunches()
    
    // Check if we should open the modal for new launch
    if (searchParams.get('action') === 'new') {
      setShowModal(true)
      // Remove the query param
      router.replace('/launches', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    filterLaunches()
  }, [filterLaunches])

  const openModal = (launch?: Launch) => {
    if (launch) {
      setEditingLaunch(launch)
      setFormData({
        title: launch.title,
        description: launch.description || '',
        status: launch.status,
        launch_date: launch.launch_date || '',
        owner: launch.owner || '',
        tags: launch.tags.join(', '),
        checklist: launch.checklist,
      })
    } else {
      setEditingLaunch(null)
      setFormData({
        title: '',
        description: '',
        status: 'Planning',
        launch_date: '',
        owner: '',
        tags: '',
        checklist: {
          blog: false,
          demo: false,
          social: false,
          partner: false,
          docs: false,
        }
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingLaunch(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const launchData = {
      title: formData.title,
      description: formData.description || null,
      status: formData.status,
      launch_date: formData.launch_date || null,
      owner: formData.owner || null,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      checklist: formData.checklist,
    }

    try {
      if (editingLaunch) {
        const { error } = await supabase
          .from('launches')
          .update(launchData)
          .eq('id', editingLaunch.id)
        
        if (error) throw error
        
        // Log activity
        await supabase.from('activity_log').insert({
          action: 'updated a launch',
          user_name: formData.owner || 'Anonymous',
          details: { launch_title: formData.title }
        })
      } else {
        const { error } = await supabase
          .from('launches')
          .insert(launchData)
        
        if (error) throw error
        
        // Log activity
        await supabase.from('activity_log').insert({
          action: 'created a new launch',
          user_name: formData.owner || 'Anonymous',
          details: { launch_title: formData.title }
        })
      }

      closeModal()
      fetchLaunches()
    } catch (error) {
      console.error('Error saving launch:', error)
    }
  }

  const deleteLaunch = async (launch: Launch) => {
    if (!confirm('Are you sure you want to delete this launch?')) return

    try {
      const { error } = await supabase
        .from('launches')
        .delete()
        .eq('id', launch.id)

      if (error) throw error

      // Log activity
      await supabase.from('activity_log').insert({
        action: 'deleted a launch',
        user_name: launch.owner || 'Anonymous',
        details: { launch_title: launch.title }
      })

      fetchLaunches()
    } catch (error) {
      console.error('Error deleting launch:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Launches</h1>
          <p className="text-muted">Manage your launch pipeline</p>
        </div>
        <Button onClick={() => openModal()} variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Launch
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search launches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="All">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Shipped">Shipped</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launches Grid */}
      {filteredLaunches.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2">No launches found</h3>
            <p className="text-muted mb-4">
              {searchTerm || statusFilter !== 'All' ? 'Try adjusting your filters' : 'Create your first launch to get started'}
            </p>
            <Button onClick={() => openModal()} variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Launch
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLaunches.map((launch) => {
            const progress = calculateProgress(launch.checklist)
            
            return (
              <Card key={launch.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{launch.title}</CardTitle>
                      <Badge className={getStatusColor(launch.status)}>
                        {launch.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {launch.description && (
                      <p className="text-sm text-muted line-clamp-2">{launch.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">
                        {launch.launch_date ? formatDate(launch.launch_date) : 'No date set'}
                      </span>
                      <span className="text-muted">{launch.owner}</span>
                    </div>

                    {launch.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {launch.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {launch.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{launch.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openModal(launch)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteLaunch(launch)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingLaunch ? 'Edit Launch' : 'Add New Launch'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter launch title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Describe the launch"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Planning' | 'In Progress' | 'Ready' | 'Shipped' })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Shipped">Shipped</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Launch Date</label>
              <input
                type="date"
                value={formData.launch_date}
                onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Launch owner"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Asset Checklist</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(formData.checklist).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setFormData({
                      ...formData,
                      checklist: { ...formData.checklist, [key]: e.target.checked }
                    })}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingLaunch ? 'Update Launch' : 'Create Launch'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default function LaunchesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    }>
      <LaunchesContent />
    </Suspense>
  )
}