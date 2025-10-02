import { NextRequest, NextResponse } from 'next/server'
import { generateAIContent, AIPromptRequest } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, inputs } = body as AIPromptRequest

    if (!type || !inputs) {
      return NextResponse.json(
        { error: 'Missing required fields: type and inputs' },
        { status: 400 }
      )
    }

    const content = await generateAIContent({ type, inputs })

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error in generate API:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}