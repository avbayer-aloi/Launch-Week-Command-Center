'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { AIPromptRequest } from '@/lib/claude'
import { 
  Sparkles, 
  FileText, 
  Share2, 
  Code, 
  HelpCircle, 
  BarChart3,
  Copy,
  Check,
  Save
} from 'lucide-react'

interface AIActionCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  inputs: Array<{
    key: string
    label: string
    type: 'text' | 'textarea'
    placeholder: string
    required?: boolean
  }>
}

const aiActions: AIActionCard[] = [
  {
    id: 'announcement',
    title: 'Generate Launch Announcement',
    description: 'Create a compelling announcement for your feature launch',
    icon: <FileText className="h-6 w-6" />,
    inputs: [
      { key: 'featureName', label: 'Feature Name', type: 'text', placeholder: 'Edge Functions 2.0', required: true },
      { key: 'keyBenefit', label: 'Key Benefit', type: 'text', placeholder: '50% faster execution time', required: true },
      { key: 'techDetails', label: 'Technical Details', type: 'textarea', placeholder: 'Built on V8 isolates with global distribution...' },
    ]
  },
  {
    id: 'social',
    title: 'Create Social Media Variants',
    description: 'Generate platform-specific social media content',
    icon: <Share2 className="h-6 w-6" />,
    inputs: [
      { key: 'title', label: 'Launch Title', type: 'text', placeholder: 'Supabase Edge Functions 2.0', required: true },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Next-generation serverless functions...', required: true },
    ]
  },
  {
    id: 'developer',
    title: 'Write Developer Angle',
    description: 'Create technical messaging focused on developers',
    icon: <Code className="h-6 w-6" />,
    inputs: [
      { key: 'description', label: 'Feature Description', type: 'textarea', placeholder: 'Describe the technical feature or capability...', required: true },
    ]
  },
  {
    id: 'faq',
    title: 'Generate FAQ',
    description: 'Create comprehensive frequently asked questions',
    icon: <HelpCircle className="h-6 w-6" />,
    inputs: [
      { key: 'featureInfo', label: 'Feature Information', type: 'textarea', placeholder: 'Provide detailed information about the feature...', required: true },
    ]
  },
  {
    id: 'competitive',
    title: 'Competitive Analysis',
    description: 'Analyze positioning against competitors',
    icon: <BarChart3 className="h-6 w-6" />,
    inputs: [
      { key: 'competitor', label: 'Competitor', type: 'text', placeholder: 'Vercel, Netlify, AWS Lambda', required: true },
      { key: 'feature', label: 'Our Feature', type: 'textarea', placeholder: 'Describe your feature and its capabilities...', required: true },
    ]
  },
]

export default function AssistantPage() {
  const [selectedAction, setSelectedAction] = useState<AIActionCard | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const openModal = (action: AIActionCard) => {
    setSelectedAction(action)
    setShowModal(true)
    setResult('')
    setFormData({})
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAction(null)
    setResult('')
    setFormData({})
    setCopied(false)
  }

  const handleGenerate = async () => {
    if (!selectedAction) return

    // Validate required fields
    const requiredFields = selectedAction.inputs.filter(input => input.required)
    const missingFields = requiredFields.filter(field => !formData[field.key]?.trim())
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    setLoading(true)
    
    try {
      const request: AIPromptRequest = {
        type: selectedAction.id as 'announcement' | 'social' | 'developer' | 'faq' | 'competitive',
        inputs: formData
      }
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      setResult(data.content)
    } catch (error) {
      console.error('Error generating content:', error)
      setResult('Error generating content. Please check your API key configuration and try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatMarkdown = (text: string) => {
    // Simple markdown formatting for display
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
            <Sparkles className="h-6 w-6 text-background" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Content Generator</h1>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by Claude
        </div>
        <p className="text-muted mt-4 max-w-2xl mx-auto">
          Generate high-quality content for your launches using AI. Choose from pre-built templates 
          or create custom content tailored to your needs.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiActions.map((action) => (
          <Card 
            key={action.id} 
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => openModal(action)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                  {action.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted text-sm mb-4">{action.description}</p>
              <Button variant="outline" className="w-full group-hover:border-accent group-hover:text-accent">
                Generate
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={selectedAction?.title || ''}
        size="xl"
      >
        {selectedAction && (
          <div className="space-y-6">
            {!result ? (
              // Input Form
              <div className="space-y-4">
                <p className="text-muted">{selectedAction.description}</p>
                
                {selectedAction.inputs.map((input) => (
                  <div key={input.key}>
                    <label className="block text-sm font-medium mb-2">
                      {input.label}
                      {input.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {input.type === 'textarea' ? (
                      <textarea
                        value={formData[input.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                        placeholder={input.placeholder}
                        required={input.required}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[input.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [input.key]: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder={input.placeholder}
                        required={input.required}
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleGenerate} 
                    className="flex-1"
                    loading={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Content'}
                  </Button>
                </div>
              </div>
            ) : (
              // Results View
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Generated Content</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-3 w-3 mr-1" />
                      Save to Launch
                    </Button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto bg-card border border-border rounded-lg p-4">
                  <div 
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: `<p class="mb-4">${formatMarkdown(result)}</p>` 
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setResult('')} 
                    className="flex-1"
                  >
                    Generate New
                  </Button>
                  <Button variant="primary" onClick={closeModal} className="flex-1">
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}